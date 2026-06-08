import MdiIconPicker from "./MdiIconPicker.vue";

MdiIconPicker.install = function(app) {
  app.component(MdiIconPicker.name, MdiIconPicker);
};

export default MdiIconPicker;

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.component(MdiIconPicker.name, MdiIconPicker);
}