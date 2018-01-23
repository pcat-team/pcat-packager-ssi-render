  module.exports = function(ret, conf, settings, opt) {
      // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
      // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
      // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
      //         可以修改静态资源列表或者其他

      fis.util.map(ret.src, function(subpath, file) {
          if (file.isPage) {
              var content = file.getContent();

              var pattern = /<(ssi)([^>]+)*>(.*?)<\/\1>/gim;

              var ssis = content.match(pattern);

              if (ssis) {

                  content = content.replace(pattern, function(tag, name, props) {

                      var propsObj = getPropsObj(props),
                          src = propsObj.src,
                          type = propsObj.type;

                      if (type == "html") {
                          tag = `<!--#include virtual="${src}" -->`

                      }

                      if (type == "jsp") {
                          tag = `<%@ include file="${src}" %>`
                      }

                      return tag;


                  });

                   file.setContent(content);


              }


          }
      })
  }


  //匹配标签的属性和值 k=v
  var prostr = /(\S+)\s*\=\s*(("[^"]*")|('[^']*'))/gi;

  // 获取属性对象
  function getPropsObj(props) {
      var obj = {};

      if (props) {
          var propsArr = props.trim().match(prostr);


          obj = require("querystring").parse(propsArr.join("&").replace(/["']/g, ""));

      }

      return obj;
  }