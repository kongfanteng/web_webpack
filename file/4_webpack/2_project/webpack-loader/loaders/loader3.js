function loader(source) {
  console.log(3) // loader1 => 1; loader2 => 2; loader3 => 3;
  return source
}
loader.pitch = () => {
  console.log('loader3-pitch');
}
module.exports = loader
