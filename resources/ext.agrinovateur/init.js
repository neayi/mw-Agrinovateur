/**
 * @class mw.AgrinovateurController
 * @singleton
 */
 ( function () {
	var agrinovateur_controller;

	agrinovateur_controller = {
		init: function () {
			var self = this;

            $('.showAgrinovateur').each(function () {
                var agrinovateurDiv = $(this);

                // NB : Tags will take over category (album)
                var tags = agrinovateurDiv.data( "tags" );
                var tags_multiple = agrinovateurDiv.data( "tags_multiple" );
                var category = agrinovateurDiv.data( "category" );
                var count = agrinovateurDiv.data( "count" );
                var search = agrinovateurDiv.data( "search" );
                var site = agrinovateurDiv.data( "site" );
                self.getImages(tags, tags_multiple, category, search, count, agrinovateurDiv, site);
            });

		},

        getImages: function (tags, tags_multiple, category, search, count, agrinovateurDiv, site) {

            var agrinovateurRootURL = '';
            if (site !== undefined)
                agrinovateurRootURL = site;

            var agrinovateurURL = agrinovateurRootURL + '/?/';

            if (search !== undefined)
            {
                agrinovateurURL = agrinovateurRootURL + '/qsearch.php?q=' + search;
            }
            else if (tags !== undefined)
            {
                agrinovateurURL = agrinovateurURL + 'tags/' + tags;
            }
            else if (tags_multiple !== undefined)
            {
                agrinovateurURL = agrinovateurURL + 'tags/' + tags_multiple.split(',').at(0); // Target the first tag only
            }
            else if (category !== undefined)
            {
                agrinovateurURL = agrinovateurURL + 'category/' + category;
            }

            var api = new mw.Api();
            api.post( {
                'action': 'agrinovateursearch',
                'tags': tags,
                'tags_multiple': tags_multiple,
                'category': category,
                'search': search,
                'count': count,
                'site': site
            } )
            .done( function ( data ) {
                // console.log("agrinovateursearch:");
                // console.log(data);

                var rowDiv = $('<div>').attr('class', 'row');
                data.agrinovateursearch.images.forEach(item => {

                    rowDiv.append($(`<div class="col-sm-12 col-md-4">
                        <a class="lightbox" href="${item.large}" data-caption="${item.caption}">
                            <img src="${item.thumb}" alt="${item.caption}">
                        </a>
                    </div>`));
                });

                agrinovateurDiv.append(rowDiv);

                // Add a button with the URL to the gallery:
                if (data.agrinovateursearch.see_more == 'true')
                    $(`<div class="text-right">
                            <a  type="button" class="btn btn-primary btn-sm text-white" href="${agrinovateurURL}" target="_blank">Voir plus de photos</a>
                        </div><br style="clear:both"/>`).insertAfter(agrinovateurDiv);
                else
                    $(`<div class="text-right">
                        <a  type="button" class="btn btn-primary btn-sm text-white" href="${agrinovateurURL}" target="_blank">Voir la galerie</a>
                        </div><br style="clear:both"/>`).insertAfter(agrinovateurDiv);

                //baguetteBox.run('.showAgrinovateur');
            } );
        }
	};

	module.exports = agrinovateur_controller;

	mw.AgrinovateurController = agrinovateur_controller;
}() );

(function () {
	$(document)
		.ready(function () {
            mw.loader.using('mediawiki.api', function() {
                // Call to the function that uses mw.Api
                mw.AgrinovateurController.init();
              } );
		});
}());

