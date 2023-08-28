function loader(source) {
  console.log(1) // loader1 => 1; loader2 => 2; loader3 => 3;
  return source
}
loader.pitch = () => {
  console.log('loader1-pitch');
}
module.exports = loader
