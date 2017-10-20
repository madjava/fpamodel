$(function(){
  plotCollaborationMap();
});
function plotCollaborationMap()
{
  d3.json("/data/fpa-data.json", function(dataJson) {
  	var model = new FPAModel(dataJson);
    var plot = new CollaborationMap("graph", "graph-info", model.getCollaborationData());
  });
}