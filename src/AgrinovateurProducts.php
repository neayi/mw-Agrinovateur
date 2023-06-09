<?php
/**
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * @file
 */

namespace MediaWiki\Extension\Agrinovateur;

use ApiBase;
use ApiMain;
use Wikimedia\ParamValidator\ParamValidator;
use MediaWiki\MediaWikiServices;

class AgrinovateurProducts extends ApiBase {

	/**
	 * @param ApiMain $main main module
	 * @param string $action name of this module
	 */
	public function __construct( $main, $action ) {
		parent::__construct( $main, $action );
	}

	/**
	 * execute the API request
	 */
	public function execute() {

		$params = $this->extractRequestParams();

		$category = $params['category'];

		$agrinovateurWSURL = "https://api.commca.fr/api/subcategories/" . $category . "/products";

		$r['ws_url'] = $agrinovateurWSURL;

		try {
			$r['products'] = $this->invokeWS($agrinovateurWSURL);
		} catch (\Exception $e) {
			$r['error'] = $e->getMessage();
		}

        $apiResult = $this->getResult();
        $apiResult->addValue( null, $this->getModuleName(), $r );
	}

	/**
	 * Get the products from agrinovateur
	 */
	private function invokeWS($agrinovateurWSURL)
	{
		$cache = MediaWikiServices::getInstance()->getMainObjectStash();
		$cacheKey = $cache->makeKey( 'agrinovateur-ext', $agrinovateurWSURL );
		$products = $cache->get( $cacheKey );

		//if (!empty($products))
		//	return $products;

		$ch = curl_init($agrinovateurWSURL);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer ' . $GLOBALS['wgAgrinovateurToken']));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		// The number of seconds to wait while trying to connect.
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);

		// The maximum number of seconds to allow cURL functions to execute.
		curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        if ($GLOBALS['env'] == 'dev')
        {
			// Ignore self signed https
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        }

		$data = curl_exec($ch);
		$result = json_decode($data, true);

		if (curl_errno($ch))
			throw new \Exception(curl_error($ch));

		curl_close($ch);

   		$cache->set( $cacheKey, $result, 200000 );

		return $result;
	}

	private function mb_rawurlencode($url)
	{
		$encoded='';
		$length=mb_strlen($url);
		for($i=0;$i<$length;$i++){
			$encoded.='%'.wordwrap(bin2hex(mb_substr($url,$i,1)),2,'%',true);
		}
		return $encoded;
	}

	/**
	 * @return array allowed parameters
	 */
	public function getAllowedParams() {
		return [
			'category' => [
				ParamValidator::PARAM_TYPE => 'string',
				ParamValidator::PARAM_REQUIRED => false
			]
		];
	}

	/**
	 * @return array examples of the use of this API module
	 */
	public function getExamplesMessages() {
		return [
			'action=' . $this->getModuleName() . '&category=26' =>
			'apihelp-' . $this->getModuleName() . '-example'
		];
	}

	/**
	 * @return string indicates that this API module does not require a CSRF toekn
	 */
	public function needsToken() {
		return false;
	}
}
