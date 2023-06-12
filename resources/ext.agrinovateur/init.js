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

                var category = agrinovateurDiv.data( "category" );
                var categorySlug = agrinovateurDiv.data( "categoryslug" );

                self.getProducts(category, categorySlug, agrinovateurDiv);
            });

		},

        getProducts: function (category, categorySlug, agrinovateurDiv) {

            var agrinovateurURL = "https://api.commca.fr/";

            if (categorySlug !== undefined)
                agrinovateurURL = "https://api.commca.fr/outils?recordId=" + categorySlug;

            var api = new mw.Api();
            api.post( {
                'action': 'agrinovateurproducts',
                'category': category
            } )
            .done( function ( data ) {
                //console.log("agrinovateurproducts:");
                //console.log(data);

                var rowDiv = $('<div>').attr('class', 'row');

                data.agrinovateurproducts.products.data.slice(-9).forEach(item => {
                    var ratings = '';

    			    let notation = Math.round(item.note);
                    var full = '<i class="fas fa-star"></i>';
                    var empty = '<i class="far fa-star"></i>';

                    if (notation != 0) {
                        for(var i = 0; i < 5; i++) {
                            ratings += i < notation ? full : empty;
                        }

                        ratings = '<div class="ratings">' + ratings + '</div>';
                    }

                    rowDiv.append($(`<div class="col-xl-4 mb-lg-0 mb-3">
			            <div class="agrinovateur very-small-card card mb-3" style="background: #F2F3F6;">
                            <div class="row no-gutters">
                                <div class="col-md-3 image-col" style="max-height: 75px; min-height: 75px;">
                                    <a href="${item.url}" data-caption="${item.name}" target="_blank">
                                        <img src="${item.picture}" class="card-img-top" alt="${item.name}" data-file-width="800" data-file-height="533">
                                    </a>
                                </div>
                                <div class="col-md-9">
                                    <div class="card-body px-2 py-1">
                                        <p class="card-text brand">${item.brand_name}</p>
                                        <p class="card-text model"><a href="${item.url}" class="stretched-link" target="_blank"><b>${item.name} </b></a></p>
                                        ${ratings}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`));

                });

                agrinovateurDiv.append(rowDiv);

                // Add a button with the URL to Agrinovateur:
                $(`<div class="text-right">
                    <a  type="button" class="btn btn-primary btn-sm text-white" href="${agrinovateurURL}" target="_blank">Voir plus</a>
                    </div><br style="clear:both"/>`).insertAfter(agrinovateurDiv);
            });
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

