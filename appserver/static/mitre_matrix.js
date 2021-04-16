/**
 * The below is a custom table renderer for the content table. It highlights colours inside the cells.
 */
require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {
    

    var MitreMapTableRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return true;
        },
        render: function($td, cell) {
            var cellvalue = cell.value;                

            if (cellvalue != null) {
                var obj = JSON.parse(cellvalue)
                var TechniqueId = obj["TechniqueId"]
                var Technique = obj["Technique"]
                var Color = obj["Color"]
                var Opacity = obj["Opacity"]
                var Events = obj["Events"]
                var Selected = obj["Selected"]
                if (typeof(obj["Groups"]) != "undefined") {
                    var Groups=obj["Groups"].split(",");
                }

                var tooltip=TechniqueId+"<br />"
                tooltip+="Events: "+Events
                if(typeof(Selected) != "undefined" && parseInt(Selected)>0) {
                    tooltip+="<br />Selected: "+Selected
                    $td.addClass("selected");
                }
                if (typeof(Groups) != "undefined") {
                    tooltip=tooltip+"<br />Threat Groups: "+Groups
                    $td.addClass("threat_group");
                }
                var HasSubTechnique=false
                if (typeof(obj["Sub_Techniques"]) != "undefined") {
                    var Sub_Techniques=obj["Sub_Techniques"];
                    HasSubTechnique=true
                    $td.addClass("has_sub_technique");
                }
                $td.attr( "style", "background-color: rgb(" + hexToRgb(Color) + "," + Opacity + ") !important;");
                $td.addClass("technique");

                

                if (HasSubTechnique) {
                    var Sub_Techniques_Container="<div class='subtechniques subtechniques-container'>" 
                    for (var key in Sub_Techniques) {
                        var SubTechnique_tooltip=""
                        SubTechnique_tooltip+=Sub_Techniques[key]["Sub_TechniqueId"]+"<br />"
                        SubTechnique_tooltip+="Events: "+Sub_Techniques[key]["Events"]
                        Sub_Techniques_Container+="<div class='subtechnique' style='background-color: rgb(" + hexToRgb(Sub_Techniques[key]["Color"]) + "," + Sub_Techniques[key]["Opacity"] + ") !important;'>"
                            Sub_Techniques_Container+="<div  class='technique-cell' style='' data-placement='right' title='"+SubTechnique_tooltip+"'>"
                                Sub_Techniques_Container+=key
                            Sub_Techniques_Container+="</div>"
                        Sub_Techniques_Container+="</div>"

                    }
                    Sub_Techniques_Container+="</div>"

                $td.html(_.template('<div class="technique-container has_sub_technique"><div class="technique" data-toggle="tooltip" data-placement="bottom" title="<%- tooltip%>"><%- celltext%></div>'+'<div class="subtechniques_expander" data-toggle="tooltip" data-placement="right" title="'+Sub_Techniques_Container+'"><span class="handle">=</span></div></div>', {
                    tooltip: tooltip,
                    celltext: Technique
                }));
                    //$td.append("<div class='subtechniques_expander' data-toggle='tooltip' data-placement='right' title='"+Sub_Techniques_Container+"'>=</div>");
                } else {
                    $td.html(_.template('<div class="technique-container"><div class="technique" data-toggle="tooltip" data-placement="bottom" title="<%- tooltip%>"><%- celltext%></div></div>', {
                        tooltip: tooltip,
                        celltext: Technique
                    }));
                }

                $td.find(".technique").tooltip({ html: 'true',boundary: 'window' })
                $td.find(".subtechniques_expander").tooltip({ trigger:'click',html: 'true',boundary: 'window' })
                $td.find(".subtechniques_expander").on('shown.bs.tooltip', function () {
                    $td.find(".subtechniques .subtechnique .technique-cell").tooltip({ html: 'true',trigger:'hover'})
                })

                


            } else {
                $td.html(cell.value);
            }
        }
    });
    if (mvc.Components.get('mitremaptable')) {

        mvc.Components.get('mitremaptable').getVisualization(function(tableView) {
            // Register custom cell renderer, the table will re-render automatically
            tableView.addCellRenderer(new MitreMapTableRenderer());
        });
    }
    if (mvc.Components.get('mitremaptable2')) {

        mvc.Components.get('mitremaptable2').getVisualization(function(tableView) {
            // Register custom cell renderer, the table will re-render automatically
            tableView.addCellRenderer(new MitreMapTableRenderer());
        });
    }
});

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(result[1], 16),
        g = parseInt(result[2], 16),
        b = parseInt(result[3], 16)
    return result ? r + ',' + g + ',' + b : null;
}