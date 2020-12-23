const gh = require('gh-pages');

gh.publish('./dist', (error) => {
  if(error) throw error;

  console.log("Published");
});