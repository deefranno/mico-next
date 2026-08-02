<?php
/**
 * Plugin Name: Mico Headless Revalidate
 * Description: Pings the astro.websage.lat frontend to refresh content instantly
 *              whenever a post or page is saved, deleted, or restored.
 * Version: 1.0
 *
 * INSTALL: upload this file to wp-content/mu-plugins/ (create that folder if it
 * doesn't exist). "mu" = must-use; it activates automatically, no Plugins-screen
 * toggle needed.
 *
 * CONFIG: set the two constants below. FRONTEND_URL is your live site, SECRET
 * must match the REVALIDATE_SECRET environment variable on Railway.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'MICO_REVALIDATE_URL', 'https://astro.websage.lat/api/revalidate' );
define( 'MICO_REVALIDATE_SECRET', 'CHANGE_ME_TO_MATCH_RAILWAY' );

/**
 * Fire a non-blocking request to the frontend to refresh the affected content.
 */
function mico_trigger_revalidate( $post_id, $post = null ) {
    // Ignore autosaves, revisions, and auto-drafts.
    if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
        return;
    }
    if ( ! $post ) {
        $post = get_post( $post_id );
    }
    if ( ! $post ) {
        return;
    }

    // Only care about published posts and pages.
    $type = $post->post_type; // 'post' or 'page'
    if ( ! in_array( $type, array( 'post', 'page' ), true ) ) {
        return;
    }

    $args = array(
        'secret' => MICO_REVALIDATE_SECRET,
        'slug'   => $post->post_name,
        'type'   => $type,
    );
    $url = add_query_arg( $args, MICO_REVALIDATE_URL );

    // Non-blocking: don't slow down the WP editor waiting for a response.
    wp_remote_post(
        $url,
        array(
            'timeout'  => 5,
            'blocking' => false,
            'headers'  => array( 'Accept' => 'application/json' ),
        )
    );
}

// Save / publish / update.
add_action( 'save_post', 'mico_trigger_revalidate', 10, 2 );
// Status transitions (publish, unpublish, trash-to-publish, etc).
add_action(
    'transition_post_status',
    function ( $new_status, $old_status, $post ) {
        if ( $new_status === 'publish' || $old_status === 'publish' ) {
            mico_trigger_revalidate( $post->ID, $post );
        }
    },
    10,
    3
);
// Deletions.
add_action( 'before_delete_post', 'mico_trigger_revalidate', 10, 1 );
