<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //

// if (strpos($_SERVER['DOCUMENT_ROOT'], '/var/www/html/') === false ) {
//   define('IS_PROD', false);
// } else {
//   define('IS_PROD', true);
// }


// if (IS_PROD) {
//   define('DB_NAME', 'wedding_en_website');
//   define('DB_USER', 'wedding_en');
// } else {
//   define('DB_NAME', 'wedding_en');
//   define('DB_USER', 'wedding');
// }

define('DB_NAME', 'webdding');
define('DB_USER', 'root');

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'S>JIYJm9;%91l|4)WPUhaA`,/(T3wfrp>eG|d6UTd2PY7M|Y,$nCHp^{3$?2d(Co' );
define( 'SECURE_AUTH_KEY',  '10G24X5(hw-y#y4dGO;t%`lHwJ80&//Wms*oZh.mb{#XcF#p8rG{F-@ey!2Ea_/]' );
define( 'LOGGED_IN_KEY',    'jhHN~X+|vlDBJcDH{{[;GO$H6#Pk8S)mlL:E5%gyFAv!l(ZzGgfsk#MMNG[0`#<;' );
define( 'NONCE_KEY',        '*?M/z.{7vVT$:LHXhrNcxf#KUL^[6t{C}VPgen$Mq(8q?Zl#XB7@-i(:~zL`FoC=' );
define( 'AUTH_SALT',        'BT;oXWkSb2Q*[bM<-2U0I=u$6Kps^#-y_SLk@&rfeuF6]J~d{;n7Ly_?JwLChHc%' );
define( 'SECURE_AUTH_SALT', '&c4|q8.K=$iV>$F&?9UHaQw;k~*/CWpmnG,t,V3^Yl!Uc.Tz}C~.jKgn0;8CvEJo' );
define( 'LOGGED_IN_SALT',   'Kbo~:cIfYBFEf=A@Yh+loA$6M0`XLRl0Ac]Ts`Mn%0q4YV+ Siu5(Rd%Ox.v$XX;' );
define( 'NONCE_SALT',       'cEseuG*|t]IZuy#mcdMT?=:(p`pNDH>DP;SnsLpkM/K#aG(O${)Zo<Q*j00H)Xh+' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
  define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
