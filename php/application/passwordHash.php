<?php

class passwordHash {

    // blowfish
    private static $algo = '$2a';
    // cost parameter
    private static $cost = '$10';

    // mainly for internal use
    public static function unique_salt() {
        return substr(sha1(mt_rand()), 0, 22);
    }

    // this will be used to generate a hash
    public static function hash($password) {

        return crypt($password, self::$algo .
                self::$cost .
                '$' . self::unique_salt());
    }

    // this will be used to compare a password against a hash
    public static function check_password($hash, $password) {
		//print_r(hash("admin1"));
        $full_salt = substr($hash, 0, 29);
		//print_r($password." hash1 ");
        $new_hash = crypt($password, $hash);
		//print_r($hash." hash1 ");
		//print_r(substr($new_hash,0,50));
        return ($hash == substr($new_hash,0,50));
    }

}

?>
