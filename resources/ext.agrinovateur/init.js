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

            var agrinovateurURL = "http://www.agrinovateur.fr/";

            if (categorySlug !== undefined)
                agrinovateurURL = "http://www.agrinovateur.fr/outils?recordId=" + categorySlug;

            var api = new mw.Api();
            api.post( {
                'action': 'agrinovateurproducts',
                'category': category
            } )
            .done( function ( data ) {
                //console.log("agrinovateurproducts:");
                //console.log(data);

                var rowDiv = $('<div>').attr('class', 'row');

                
                data.agrinovateurproducts.products.data.forEach(item => { 
                    rowDiv.append($(`<div class="col-sm-12 col-md-4">
			            <div class="card bg-light mb-3" style="width: 18rem;">
                            <div class="card-body">
                        	    <a href="${item.url}" data-caption="${item.name}" target="_blank">
                            	    <img src="${item.picture}" class="card-img-top" alt="${item.name}">
				                </a>
					            <p class="card-text"><a href="#" class="stretched-link"><b>${item.name} </b>${item.brand_name}</a></p>
    					        <div class="d-flex justify-content-between align-items-center">
                                    <div class="ratings">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`));

                    // Prise en compte des notes diverses, remplis étoiles correspondant à la note
                    if (item.note != null) {
                        let notation = Math.round(item.note);
                        jQuery(function($) {
                            $(".ratings").append(new Array(++notation).join('<i class="fa fa-star rating-color"></i>'));
                        });
                    }  
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

