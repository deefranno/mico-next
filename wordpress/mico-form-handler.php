<?php
/**
 * Plugin Name: Mico Form Handler
 * Description: REST endpoint for the astro.websage.lat contact & admissions
 *              forms. Saves each submission as a viewable entry in WP admin
 *              and emails a notification.
 * Version: 1.0
 *
 * INSTALL: upload to wp-content/mu-plugins/ (create the folder if needed).
 * Must-use plugins activate automatically.
 *
 * CONFIG: set the constants below.
 *   MICO_FORM_NOTIFY_TO   — where notification emails go (change anytime).
 *   MICO_FORM_NOTIFY_FROM — a mailbox ON your domain, for reliable delivery.
 *   MICO_FORM_ALLOW_ORIGIN— your frontend origin (for CORS).
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'MICO_FORM_NOTIFY_TO', 'duanefranklyn@gmail.com' );
define( 'MICO_FORM_NOTIFY_FROM', 'noreply@websage.lat' ); // create this mailbox in cPanel
define( 'MICO_FORM_ALLOW_ORIGIN', 'https://astro.websage.lat' );

/* --------------------------------------------------------------------------
 * 1. Register a custom post type to store submissions (viewable in WP admin).
 * ------------------------------------------------------------------------ */
add_action( 'init', function () {
    register_post_type( 'mico_submission', array(
        'labels' => array(
            'name'          => 'Form Submissions',
            'singular_name' => 'Submission',
            'menu_name'     => 'Form Submissions',
        ),
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-email-alt',
        'supports'     => array( 'title' ),
        'capability_type' => 'post',
        'map_meta_cap'    => true,
    ) );
} );

/* Show submission fields as a meta box in the admin entry view. */
add_action( 'add_meta_boxes', function () {
    add_meta_box(
        'mico_submission_data',
        'Submission Details',
        function ( $post ) {
            $fields = get_post_meta( $post->ID, '_mico_fields', true );
            if ( ! is_array( $fields ) ) {
                echo '<p>No data.</p>';
                return;
            }
            echo '<table style="width:100%;border-collapse:collapse">';
            foreach ( $fields as $k => $v ) {
                printf(
                    '<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #eee;width:160px">%s</th><td style="padding:6px;border-bottom:1px solid #eee">%s</td></tr>',
                    esc_html( ucfirst( str_replace( '_', ' ', $k ) ) ),
                    nl2br( esc_html( $v ) )
                );
            }
            echo '</table>';
        },
        'mico_submission',
        'normal',
        'high'
    );
} );

/* --------------------------------------------------------------------------
 * 2. REST endpoint: POST /wp-json/mico/v1/submit
 * ------------------------------------------------------------------------ */
add_action( 'rest_api_init', function () {
    register_rest_route( 'mico/v1', '/submit', array(
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => 'mico_handle_submission',
    ) );
} );

function mico_handle_submission( WP_REST_Request $request ) {
    $body = $request->get_json_params();
    if ( empty( $body ) ) {
        $body = $request->get_params();
    }

    // --- Honeypot: if the hidden field is filled, it's a bot. Pretend success. ---
    if ( ! empty( $body['company'] ) ) {
        return new WP_REST_Response( array( 'success' => true ), 200 );
    }

    // --- Which form? ---
    $form_type = isset( $body['form_type'] ) ? sanitize_text_field( $body['form_type'] ) : 'contact';
    $form_type = in_array( $form_type, array( 'contact', 'admissions' ), true ) ? $form_type : 'contact';

    // --- Basic validation ---
    $errors = array();
    $email  = isset( $body['email'] ) ? sanitize_email( $body['email'] ) : '';
    if ( ! is_email( $email ) ) {
        $errors[] = 'A valid email is required.';
    }

    // --- Simple rate limit: max 5 submissions / 10 min per IP ---
    $ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( $_SERVER['REMOTE_ADDR'] ) : 'unknown';
    $key = 'mico_rl_' . md5( $ip );
    $count = (int) get_transient( $key );
    if ( $count >= 5 ) {
        return new WP_REST_Response(
            array( 'success' => false, 'message' => 'Too many submissions. Please try again later.' ),
            429
        );
    }

    if ( ! empty( $errors ) ) {
        return new WP_REST_Response(
            array( 'success' => false, 'message' => implode( ' ', $errors ) ),
            400
        );
    }

    // --- Collect the fields per form type ---
    if ( $form_type === 'admissions' ) {
        $fields = array(
            'student_type' => sanitize_text_field( $body['studentType']  ?? '' ),
            'first_name'   => sanitize_text_field( $body['firstName']    ?? '' ),
            'last_name'    => sanitize_text_field( $body['lastName']     ?? '' ),
            'email'        => $email,
            'phone'        => sanitize_text_field( $body['phone']        ?? '' ),
            'date_of_birth'=> sanitize_text_field( $body['dob']          ?? '' ),
            'school'       => sanitize_text_field( $body['school']       ?? '' ),
            'term'         => sanitize_text_field( $body['term']         ?? '' ),
            'major'        => sanitize_text_field( $body['major']        ?? '' ),
        );
        $title   = sprintf( 'Application — %s %s', $fields['first_name'], $fields['last_name'] );
        $subject = 'New Mico Application: ' . $fields['first_name'] . ' ' . $fields['last_name'];
    } else {
        $fields = array(
            'name'    => sanitize_text_field( $body['name']    ?? '' ),
            'email'   => $email,
            'subject' => sanitize_text_field( $body['subject'] ?? '' ),
            'message' => sanitize_textarea_field( $body['message'] ?? '' ),
        );
        $title   = sprintf( 'Contact — %s', $fields['name'] );
        $subject = 'New Mico Contact Message from ' . $fields['name'];
    }

    // --- Save it (never lost, even if email fails) ---
    $post_id = wp_insert_post( array(
        'post_type'   => 'mico_submission',
        'post_status' => 'publish',
        'post_title'  => $title !== '' ? $title : ( ucfirst( $form_type ) . ' submission' ),
    ) );

    if ( is_wp_error( $post_id ) ) {
        return new WP_REST_Response(
            array( 'success' => false, 'message' => 'Could not save submission.' ),
            500
        );
    }

    update_post_meta( $post_id, '_mico_fields', $fields );
    update_post_meta( $post_id, '_mico_form_type', $form_type );
    update_post_meta( $post_id, '_mico_ip', $ip );

    // Bump the rate-limit counter.
    set_transient( $key, $count + 1, 10 * MINUTE_IN_SECONDS );

    // --- Email notification ---
    $lines = array();
    foreach ( $fields as $k => $v ) {
        $lines[] = ucfirst( str_replace( '_', ' ', $k ) ) . ': ' . $v;
    }
    $message_body = implode( "\n", $lines );

    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'From: Mico University <' . MICO_FORM_NOTIFY_FROM . '>',
        'Reply-To: ' . $email,
    );

    wp_mail( MICO_FORM_NOTIFY_TO, $subject, $message_body, $headers );

    return new WP_REST_Response(
        array( 'success' => true, 'message' => 'Submission received.' ),
        200
    );
}

/* --------------------------------------------------------------------------
 * 3. CORS — allow the frontend origin to POST here.
 * ------------------------------------------------------------------------ */
add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function ( $served ) {
        header( 'Access-Control-Allow-Origin: ' . MICO_FORM_ALLOW_ORIGIN );
        header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type' );
        return $served;
    } );
}, 15 );

/* --------------------------------------------------------------------------
 * 4. CSV export — adds "Export" buttons above the Form Submissions list and
 *    streams a spreadsheet-ready CSV.
 * ------------------------------------------------------------------------ */

// Export buttons shown at the top of the submissions list screen.
add_action( 'manage_posts_extra_tablenav', function ( $which ) {
    global $typenow;
    if ( $typenow !== 'mico_submission' || $which !== 'top' ) {
        return;
    }
    $base = admin_url( 'edit.php?post_type=mico_submission' );
    $all  = wp_nonce_url( $base . '&mico_export=all', 'mico_export' );
    $con  = wp_nonce_url( $base . '&mico_export=contact', 'mico_export' );
    $adm  = wp_nonce_url( $base . '&mico_export=admissions', 'mico_export' );
    echo '<div class="alignleft actions" style="padding:2px 8px 0 0">';
    echo '<a href="' . esc_url( $all ) . '" class="button">Export All (CSV)</a> ';
    echo '<a href="' . esc_url( $con ) . '" class="button">Export Contact</a> ';
    echo '<a href="' . esc_url( $adm ) . '" class="button">Export Admissions</a>';
    echo '</div>';
} );

// Handle the export request and stream the CSV.
add_action( 'admin_init', function () {
    if ( empty( $_GET['mico_export'] ) ) {
        return;
    }
    if ( ! current_user_can( 'edit_posts' ) ) {
        wp_die( 'Not allowed.' );
    }
    check_admin_referer( 'mico_export' );

    $which = sanitize_text_field( wp_unslash( $_GET['mico_export'] ) );
    $meta_query = array();
    if ( in_array( $which, array( 'contact', 'admissions' ), true ) ) {
        $meta_query[] = array(
            'key'   => '_mico_form_type',
            'value' => $which,
        );
    }

    $posts = get_posts( array(
        'post_type'      => 'mico_submission',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'date',
        'order'          => 'DESC',
        'meta_query'     => $meta_query,
    ) );

    // Build the column set from every field present across all rows.
    $columns = array();
    $rows    = array();
    foreach ( $posts as $p ) {
        $fields = get_post_meta( $p->ID, '_mico_fields', true );
        $type   = get_post_meta( $p->ID, '_mico_form_type', true );
        if ( ! is_array( $fields ) ) {
            $fields = array();
        }
        $row = array(
            'date'      => get_the_date( 'Y-m-d H:i', $p ),
            'form_type' => $type,
        );
        foreach ( $fields as $k => $v ) {
            $row[ $k ] = $v;
            $columns[ $k ] = true;
        }
        $rows[] = $row;
    }

    $headers = array_merge( array( 'date', 'form_type' ), array_keys( $columns ) );

    // Stream as CSV.
    $filename = 'mico-submissions-' . $which . '-' . date( 'Y-m-d' ) . '.csv';
    header( 'Content-Type: text/csv; charset=utf-8' );
    header( 'Content-Disposition: attachment; filename=' . $filename );

    $out = fopen( 'php://output', 'w' );
    // UTF-8 BOM so Excel reads accents correctly.
    fprintf( $out, chr( 0xEF ) . chr( 0xBB ) . chr( 0xBF ) );
    fputcsv( $out, array_map( function ( $h ) {
        return ucfirst( str_replace( '_', ' ', $h ) );
    }, $headers ) );

    foreach ( $rows as $row ) {
        $line = array();
        foreach ( $headers as $h ) {
            $line[] = isset( $row[ $h ] ) ? $row[ $h ] : '';
        }
        fputcsv( $out, $line );
    }
    fclose( $out );
    exit;
} );
