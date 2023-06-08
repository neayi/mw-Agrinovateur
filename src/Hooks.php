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

use FormatJson;
use Parser;
use PPFrame;

class Hooks implements
	\MediaWiki\Hook\ParserFirstCallInitHook
{
	/**
	 * Register parser hooks to add the agrinovateur keyword
	 *
	 * @see https://www.mediawiki.org/wiki/Manual:Hooks/ParserFirstCallInit
	 * @see https://www.mediawiki.org/wiki/Manual:Parser_functions
	 * @param Parser $parser
	 * @throws \MWException
	 */
	public function onParserFirstCallInit( $parser ) {

		// Add the following to a wiki page to see how it works:
		// {{#agrinovateur: tags=1 | tags=2 | count = 10 }}
		$parser->setFunctionHook( 'agrinovateur', [ self::class, 'parserFunctionAgrinovateur' ] );

		return true;
	}

	/**
	 * Parser function handler for {{#agrinovateur: .. | .. }}
	 *
	 * @param Parser $parser
	 * @param string $value
	 * @param string ...$args
	 * @return string HTML to insert in the page.
	 */
	public static function parserFunctionAgrinovateur( Parser $parser, string $value, ...$args ) {

		$parser->getOutput()->addModules( 'ext.agrinovateur' );

		if (empty($GLOBALS['wgAgrinovateurToken']))
		{
			return '<p>Please add <code>$wgAgrinovateurToken</code> to your LocalSettings.php</p>';
		}

		if (empty($args[0]) || empty($value))
		{
			return '<p>Please enter the category id and slud: {{#agrinovateurs:26|recsSaN8fE0mLrIT9}}</p>';
		}

		$category = trim($value);
		$categorySlug = trim($args[0]);

		$ret = '<div class="showAgrinovateur" data-category="'.htmlspecialchars($category).'" data-categorySlug="'.htmlspecialchars($categorySlug).'"></div>';
		return $ret;
	}
}
