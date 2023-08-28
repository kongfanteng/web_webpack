function loader(source) {
  console.log(2) // loader1 => 1; loader2 => 2; loader3 => 3;
  return source
}
loader.pitch = () => {
  console.log('loader2-pitch');
}
module.exports = loader
