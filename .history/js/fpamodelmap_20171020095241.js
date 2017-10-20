 function FPAModel(data) {
     this.model = data;
 };

 FPAModel.prototype.getCollaborationData = function() {
     var roles = this.getAllRoles();
     var dItems = this.getdItemList(roles);
     var collaborations = this.getCollabrationList();
     var projects = this.getProjectList();
     var collabMapData = {
         ditems: dItems,
         projects: projects,
         collaborations: collaborations
     };
     return collabMapData;
 };

 FPAModel.prototype.getAllRoles = function() {
     var roles = _.map(this.model, function(data) {
         return data.role;
     });
     return this.sortUnique(roles);
 };

 FPAModel.prototype.getAllLinks = function(linkProp, roleName) {
     var filtered = _.where(this.model, { role: roleName });
     filtered = _.uniq(_.map(filtered, function(data) {
         return (linkProp === 'fromModel') ? data[linkProp] + ' -' : '- ' + data[linkProp];
     }));
     return filtered;
 };

 //center
 FPAModel.prototype.getdItemList = function(roles) {
     var _self = this;
     var dItemList = [];
     _.each(roles, function(role) {
         var item = _self.dItemTemplate(role);
         var linksList = _self.sortUnique([].concat(_self.getAllLinks('toModel', role),
             _self.getAllLinks('fromModel', role)));
         item.links = linksList;
         item.ditem = _.size(linksList);
         item.description = "A short discription of the " + role + " role";
         dItemList.push(item);
     });
     return this.sortUnique(dItemList);
 };

 //right
 FPAModel.prototype.getCollabrationList = function() {
     var _self = this;
     var list = [];
     _.each(this.model, function(data) {
         list.push(_self.collabTemplate(data.toModel));
     });
     return _.uniq(list.sort(this.compare), 'name');
 };

 //left
 FPAModel.prototype.getProjectList = function() {
     var _self = this;
     var list = [];
     _.each(this.model, function(data) {
         list.push(_self.projectTemplate(data.role, data.fromModel));
     });
     return _.uniq(list.sort(this.compare), 'name');
 };

 FPAModel.prototype.sortUnique = function(data, iteratee) {
     return _.uniq(_.sortBy(data));
 };


 FPAModel.prototype.dItemTemplate = function(roleName) {
     var name = roleName;
     return {
         type: "ditem",
         name: name,
         description: null,
         ditem: 0,
         slug: "#",
         links: []
     };
 };

 FPAModel.prototype.collabTemplate = function(value) {
     var slug = String(value).toLowerCase().replace(/\s/g, '');
     var name = '- ' + value;
     return {
         type: "collaboration",
         name: name,
         description: null,
         slug: slug
     };
 };

 FPAModel.prototype.projectTemplate = function(role, value) {
     var slug = String(role).toLowerCase().replace(/\s/g, '');
     var name = value + ' -';
     return {
         type: "project",
         name: name,
         description: null,
         slug: slug
     };
 };

 FPAModel.prototype.compare = function(a, b) {
     if (a.name < b.name)
         return -1;
     if (a.name > b.name)
         return 1;
     return 0;
 };