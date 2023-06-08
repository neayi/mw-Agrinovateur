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
                var category = agrinovateurDiv.data( "category" );

                self.getProducts(category, agrinovateurDiv);
            });

		},

        getProducts: function (category, agrinovateurDiv) {

            var agrinovateurRootURL = '';

            var agrinovateurURL = agrinovateurRootURL;
            
            if (category !== undefined)
            {
                agrinovateurURL = agrinovateurURL + 'subcategories/' + category;
            }

            var api = new mw.Api();
            api.post( {
                'action': 'agrinovateursearch',
                'category': category
            } )
            .done( function ( data ) {
                //console.log("agrinovateursearch:");
                //console.log(data);

                var rowDiv = $('<div>').attr('class', 'row');
                data.agrinovateursearch.images.forEach(item => {

                    rowDiv.append($(`<div class="col-sm-12 col-md-4">
                        <a class="lightbox" href="${item.large}" data-caption="${item.caption}">
                            <img src="${item.thumb}" alt="${item.caption}">
                        </a>
                    </div>`));
                });

                agrinovateurDiv.append(rowDiv);

                /*
                // Add a button with the URL to the gallery:
                if (data.agrinovateursearch.see_more == 'true')
                    $(`<div class="text-right">
                            <a  type="button" class="btn btn-primary btn-sm text-white" href="${agrinovateurURL}" target="_blank">Voir plus de photos</a>
                        </div><br style="clear:both"/>`).insertAfter(agrinovateurDiv);
                else
                    $(`<div class="text-right">
                        <a  type="button" class="btn btn-primary btn-sm text-white" href="${agrinovateurURL}" target="_blank">Voir la galerie</a>
                        </div><br style="clear:both"/>`).insertAfter(agrinovateurDiv);

                */
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

