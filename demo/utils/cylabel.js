var config = {
  textAlign:'left',
  defaultFontStyle: "normal",
  defaultFontSize: '16px',
  defaultFontColor: 'black',
  defaultFontWeight: 'normal',
  defaultfontFamily: 'sans-serif',
  defaultFontGap: 1,
  defaultanimationDuration: 50,
};

function formatFontSizeUnit(fontsize) {
  if (fontsize.indexOf("px") >= 0) {
    var value = fontsize.replace(/px/g, '');
    return parseFloat(value);
  }
  return parseFloat(fontsize);
}
/////////////////////////////attriTextSegment//////////////////////////
var attriTextSegment = function textSeg(content, fontsize, fontcolor, fontweight, fontstyle, fontfamily){
  this.content = content;
  this.fontstyle = typeof fontstyle != 'undefined' ? fontstyle : config.defaultFontStyle;
  this.fontsize = typeof fontsize != 'undefined' ? fontsize : config.defaultFontSize;
  this.fontcolor = typeof fontcolor != 'undefined' ? fontcolor : config.defaultFontColor;
  this.fontweight = typeof fontweight != 'undefined' ? fontweight : config.defaultFontWeight;
  this.fontfamily = typeof fontfamily != 'undefined' ? fontfamily : config.defaultfontFamily;
}

attriTextSegment.prototype.measure = function(ctx) {
  if (ctx) {
    ctx.save();
    ctx.font = this.fontsize + " " + this.fontweight;
    var width=  ctx.measureText(this.content).width;
    ctx.restore();
    return width;
  }
  return 0;
}

attriTextSegment.prototype.compare = function (seg) {
  if (this.content != seg.content || this.fontsize != seg.fontsize || this.fontcolor != seg.fontcolor || this.fontweight != seg.fontweight) {
    return 1;//表示不等于
  }
  return 0;//表示等于
}
/////////////////////////////attriTextSection//////////////////////////
var attriTextSection = function attriTextSection(content, fontsize, fontcolor, fontweight, fontstyle, fontfamily) {
  this.content = content;
  this.fontstyle = typeof fontstyle != 'undefined' ? fontstyle : config.defaultFontStyle;
  this.fontsize = typeof fontsize != 'undefined' ? fontsize : config.defaultFontSize;
  this.fontcolor = typeof fontcolor != 'undefined' ? fontcolor : config.defaultFontColor;
  this.fontweight = typeof fontweight != 'undefined' ? fontweight : config.defaultFontWeight;
  this.fontfamily = typeof fontfamily != 'undefined' ? fontfamily : config.defaultfontFamily;
}
/////////////////////////////attriText//////////////////////////
var attriText = function attriText(content, thisvalue) {
  if (typeof content != "string") content = "";
  this.defaultFontGap = thisvalue ? (thisvalue.defaultFontGap ? thisvalue.defaultFontGap : config.defaultFontGap) : config.defaultFontGap;
  this.sections = [];
  //找出html的label标签
  var reg = new RegExp("<label[ =#-:;'\"0-9A-Za-z]*>.*?</label>", "g");
  var results = content.match(reg);
  if (results != null) {
    results.forEach((res) => {
      if (res != null) {
        var content = "";
        var fontsize = thisvalue ? thisvalue.defaultFontSize : undefined;
        var fontcolor = thisvalue ? thisvalue.defaultFontColor :  undefined;
        var fontweight = thisvalue ? thisvalue.defaultFontWeight :  undefined;
        var fontstyle = thisvalue ? thisvalue.defaultFontStyle : undefined;
        var fontfamily = thisvalue ? thisvalue.defaultfontFamily : undefined;
        //获取内容
        var res_content = res.match(">.*<");
        if (res_content != null){
          if (res_content[0].length >= 2){
            res_content = res_content[0].substring(1, res_content[0].length - 1);
          }
          else {
            res_content = "";
          }
        }
        else {
          res_content = "";
        }
        content = res_content;
        //获取属性
        var res_style = res.match("style.*='.*'");
        if (res_style == null) {
          res_style = res.match('style.*=".*"');
        }
        if (res_style != null) {
          var styles = res_style[0].split("=");
          if (styles.length == 2) {
            var styleAttr = styles[1].replace(/'/g,'').replace(/"/g,'').split(";");
            styleAttr.forEach((item)=>{
              var attrKeyValue = item.split(":");
              if (attrKeyValue.length == 2) {
                switch (attrKeyValue[0].trim()) {
                  case 'color':
                    fontcolor = attrKeyValue[1].trim();
                    break;
                  case 'font-size':
                    fontsize = attrKeyValue[1].trim();
                    break;
                  case 'font-weight':
                    fontweight = attrKeyValue[1].trim();
                    break;
                  case 'font-style':
                    fontstyle = attrKeyValue[1].trim();
                    break;
                  case 'font-family':
                    fontfamily = attrKeyValue[1].trim();
                    break;
                }
              }
            })
          }
        } 
        var section = new attriTextSection(content, fontsize, fontcolor, fontweight, fontstyle, fontfamily );
        this.sections.push(section);
      }
    });
  }
  var defaultSections = content.split(reg);
  var pos = 0;
  defaultSections.forEach((item,index)=>{
    if (item.length > 0) {
      var fontsize = thisvalue ? thisvalue.defaultFontSize : undefined;
      var fontcolor = thisvalue ? thisvalue.defaultFontColor : undefined;
      var fontweight = thisvalue ? thisvalue.defaultFontWeight : undefined;
      var fontstyle = thisvalue ? thisvalue.defaultFontStyle : undefined;
      var fontfamily = thisvalue ? thisvalue.defaultfontFamily : undefined;
      var section = new attriTextSection(item, fontsize, fontcolor, fontweight, fontstyle, fontfamily );
      this.sections.splice(index + pos, 0, section);
      pos++;
    }
  });
}

attriText.prototype.maxfont = function() {
  var maxfontsize = 0;
  this.sections.forEach((item)=>{
    if (formatFontSizeUnit(item.fontsize) > maxfontsize) {
      maxfontsize = formatFontSizeUnit(item.fontsize);
    }
  })
  return maxfontsize;
}

attriText.prototype.length = function() {
  var len = 0;
  this.sections.forEach((seg)=>{
    len += seg.content.length;
  });
  return len;
}

attriText.prototype.indexOf = function(index) {
  if (typeof this.sections != 'undefined') {
    var min = 0, max = 0;
    for (var i = 0; i < this.sections.length; i++) {
      max += this.sections[i].content.length;
      if (index >= min && index < max) {
        var seg_char = this.sections[i].content[index - min];
        var seg_fontsize = this.sections[i].fontsize;
        var seg_fontcolor = this.sections[i].fontcolor;
        var seg_fontweight = this.sections[i].fontweight;
        var seg = new attriTextSegment(seg_char, seg_fontsize, seg_fontcolor, seg_fontweight);
        return seg;
      }
      min = max;
    }
  }
  return new attriTextSegment("");
}

attriText.prototype.measure = function (ctx, start, end) {
  if (ctx) {
    var s = 0, e = this.length();
    if (typeof start != "undefined" && typeof end != "undefined" ){
      if (start < end) {
        s = start;
        e = end;
      }
      else {
        return 0;
      }
    }
    var width = 0;
    for (let i = s; i < e; i++) {
      var seg = this.indexOf(i);
      var segwidth = seg.measure(ctx);
      var gap = this.defaultFontGap;
      width += segwidth + gap;
    }
    return width;
  }
  return 0;
}
/////////////////////////////cylabel//////////////////////////
function animation(ctx, attri, percent) {
  if (typeof percent == "undefined") {
    percent = 0;
  }
  else if (percent > 1) {
    percent = 1;
  }
  attri.forEach((item) => {
    if (item.atype == "static") {
      ctx.setFillStyle(item.newchar.fontcolor);
      ctx.font = (item.newchar.fontstyle + " " + item.newchar.fontweight + " " + item.newchar.fontsize + " " + item.newchar.fontfamily).trim();
      ctx.fillText(item.newchar.content, item.new_x, item.new_y);
    }
    else {
      ctx.setGlobalAlpha(1 - percent);
      ctx.setFillStyle(item.oldchar.fontcolor);
      ctx.font = (item.oldchar.fontstyle + " " + item.oldchar.fontweight + " " + item.oldchar.fontsize + " " + item.oldchar.fontfamily).trim();
      ctx.fillText(item.oldchar.content, item.old_x, item.old_y - formatFontSizeUnit(item.oldchar.fontsize) * percent);
      ctx.setGlobalAlpha(percent);
      ctx.setFillStyle(item.newchar.fontcolor);
      ctx.font = (item.newchar.fontstyle + " " + item.newchar.fontweight + " " + item.newchar.fontsize + " " + item.newchar.fontfamily).trim();
      ctx.fillText(item.newchar.content, item.new_x, item.new_y + formatFontSizeUnit(item.newchar.fontsize) * (1 - percent));
      ctx.setGlobalAlpha(1);
    }
  })
  ctx.draw();
}

var cylabel = function cylabel(canvasid, canvasWidth, canvasHeight, thisValue) {
  if (typeof thisValue == "undefined") {
    this.ctx = wx.createCanvasContext(canvasid);
  }
  else {
    this.ctx = wx.createCanvasContext(canvasid, thisValue);
  }
  this.ctx.setTextAlign('left');
  this.ctx.setTextBaseline('bottom');
  this.w = canvasWidth;
  this.h = canvasHeight;
  this.content = new attriText("");
  this.animationPool = [];
  this.animationRun = false;
}

cylabel.prototype.setDefaultParameter = function (option) {
  this.textAlign = option.textAlign;
  this.defaultFontStyle = option.defaultFontStyle;
  this.defaultFontSize = option.defaultFontSize;
  this.defaultFontColor = option.defaultFontColor;
  this.defaultFontWeight = option.defaultFontWeight;
  this.defaultfontFamily = option.defaultfontFamily;
  this.defaultFontGap = option.defaultFontGap;
  this.defaultanimationDuration = option.defaultanimationDuration;
}

cylabel.prototype.DrawWithoutAnimtion = function(content, thisValue) {
  thisValue.animationPool.splice(0, thisValue.animationPool.length);
  thisValue.AnimationRun = false;
  animation(thisValue.ctx, content, 1);
}

cylabel.prototype.runAnimation = function (thisValue) {
  if (thisValue.animationPool.length > 0) {
    thisValue.AnimationRun = true;
    var ani = this.animationPool[0];
    if (ani.percent < 1) {
      setTimeout(() => {
        if (thisValue.AnimationRun) {
          animation(thisValue.ctx, ani.data, ani.percent);
          thisValue.runAnimation(thisValue);
          ani.percent += 0.1;
        }
      }, ani.span);
    }
    else {
      thisValue.animationPool.splice(0, 1);
      setTimeout(() => {
        thisValue.runAnimation(thisValue);
      }, ani.span);
    }
  }
  else {
    thisValue.AnimationRun = false;
  }
}
cylabel.prototype.setText = function(content, hasAnimation) {
  var that = this;
  var attrChars = [];
  var attrContent = new attriText(content, this);
  //参数配置
  var alignType = config.textAlign;
  var gap = config.defaultFontGap;
  if (this.textAlign) {
    alignType = this.textAlign;
  }
  if (this.defaultFontGap) {
    gap = this.defaultFontGap;
  }
  var isanimation = true;
  if (typeof hasAnimation != "undefined" ) {
    isanimation = hasAnimation;
  }
  var animationDuration = config.defaultanimationDuration;
  if (this.defaultanimationDuration) {
    animationDuration = this.defaultanimationDuration;
  }
  //计算位置
  var new_maxfont = attrContent.maxfont();
  var old_maxfont = this.content.maxfont();
  if (alignType == "left") {
    var old_cursorpx = 0, new_cursorpx = 0;
    var len = attrContent.length() > this.content.length() ? attrContent.length() : this.content.length();
    for (var i = 0; i < len; i++) {
      var newseg = attrContent.indexOf(i);
      let newcharwidth = newseg.measure(this.ctx);
      var oldseg = this.content.indexOf(i);
      let oldcharwidth = oldseg.measure(this.ctx);
      if (newseg.compare(oldseg) == 0 || !isanimation) {
        attrChars.push({ newchar: newseg, atype: 'static', new_x: new_cursorpx, new_y: this.h - (this.h - new_maxfont) / 3. - (new_maxfont - formatFontSizeUnit(newseg.fontsize)) / 4. });
      }
      else {
        attrChars.push({ newchar: newseg, oldchar: oldseg, atype: 'dynamic', old_x: old_cursorpx, new_x: new_cursorpx, old_y: this.h - (this.h - old_maxfont) / 3. - (old_maxfont - formatFontSizeUnit(oldseg.fontsize)) / 4, new_y: this.h - (this.h - new_maxfont) / 3. - (new_maxfont - formatFontSizeUnit(newseg.fontsize)) / 4});
      }
      old_cursorpx += (oldcharwidth + gap);
      new_cursorpx += (newcharwidth + gap);
    }
  }
  else if (alignType == "right") {
    var new_cursorpx = this.w;
    var old_cursorpx = this.w;
    var len = attrContent.length() > this.content.length() ? attrContent.length() : this.content.length();
    for (var i = 0; i < len ; i++) {
      var newseg = attrContent.indexOf(attrContent.length() - i - 1);
      let newcharwidth = newseg.measure(this.ctx);
      var oldseg = this.content.indexOf(this.content.length() - i - 1);
      let oldcharwidth = oldseg.measure(this.ctx);
      if (newseg.compare(oldseg) == 0 || !isanimation) {
        attrChars.push({ newchar: newseg, atype: 'static', new_x: new_cursorpx - newcharwidth, new_y: this.h - (this.h - new_maxfont) / 3. - (new_maxfont - formatFontSizeUnit(newseg.fontsize)) / 4. });
      }
      else {
        attrChars.push({ newchar: newseg, oldchar: oldseg, atype: 'dynamic', old_x: old_cursorpx - oldcharwidth, new_x: new_cursorpx - newcharwidth, old_y: this.h - (this.h - old_maxfont) / 3. - (old_maxfont - formatFontSizeUnit(oldseg.fontsize)) / 4, new_y: this.h - (this.h - new_maxfont) / 3. - (new_maxfont - formatFontSizeUnit(newseg.fontsize)) / 4 });
      }
      old_cursorpx -= (oldcharwidth + gap);
      new_cursorpx -= (newcharwidth + gap);
    }
  }
  else if (alignType == "center") {
    var len = attrContent.length() > this.content.length() ? attrContent.length() : this.content.length();
    var centerCharacterIndex = Math.round(len / 2) - 1;
    var deltalen = attrContent.measure(this.ctx, 0, centerCharacterIndex) - attrContent.measure(this.ctx, centerCharacterIndex + 1, attrContent.length());
    var new_cursorpx = (this.w + deltalen) / 2.;
    var old_cursorpx = (this.w + deltalen) / 2.;
    for (let i = 0; i < centerCharacterIndex; i++) {
      var newseg = attrContent.indexOf(centerCharacterIndex - i - 1);
      let newcharwidth = newseg.measure(this.ctx);
      var oldseg = this.content.indexOf(centerCharacterIndex - i - 1);
      let oldcharwidth = oldseg.measure(this.ctx);
      if (newseg.compare(oldseg) == 0 || !isanimation) {
        attrChars.push({ newchar: newseg, atype: 'static', new_x: new_cursorpx - newcharwidth, new_y: this.h - (this.h - new_maxfont) / 3. - (new_maxfont - formatFontSizeUnit(newseg.fontsize)) / 4. });
      }
      else {
        attrChars.push({ newchar: newseg, oldchar: oldseg, atype: 'dynamic', old_x: old_cursorpx - oldcharwidth, new_x: new_cursorpx - newcharwidth, old_y: this.h - (this.h - old_maxfont) / 3. - (old_maxfont - formatFontSizeUnit(oldseg.fontsize)) / 4, new_y: this.h - (this.h - new_maxfont) / 3. - (new_maxfont - formatFontSizeUnit(newseg.fontsize)) / 4 });
      }
      old_cursorpx -= (oldcharwidth + gap);
      new_cursorpx -= (newcharwidth + gap);
    }
    var new_cursorpx = (this.w + deltalen) / 2.;
    var old_cursorpx = (this.w + deltalen) / 2.;
    for (let i = 0; i < len - centerCharacterIndex; i++) {
      var newseg = attrContent.indexOf(centerCharacterIndex + i);
      let newcharwidth = newseg.measure(this.ctx);
      var oldseg = this.content.indexOf(centerCharacterIndex + i);
      let oldcharwidth = oldseg.measure(this.ctx);
      if (newseg.compare(oldseg) == 0 || !isanimation) {
        attrChars.push({ newchar: newseg, atype: 'static', new_x: new_cursorpx, new_y: this.h - (this.h - new_maxfont) / 3. - (new_maxfont - formatFontSizeUnit(newseg.fontsize)) / 4. });
      }
      else {
        attrChars.push({ newchar: newseg, oldchar: oldseg, atype: 'dynamic', old_x: old_cursorpx, new_x: new_cursorpx, old_y: this.h - (this.h - old_maxfont) / 3. - (old_maxfont - formatFontSizeUnit(oldseg.fontsize)) / 4, new_y: this.h - (this.h - new_maxfont) / 3. - (new_maxfont - formatFontSizeUnit(newseg.fontsize)) / 4 });
      }
      old_cursorpx += (oldcharwidth + gap);
      new_cursorpx += (newcharwidth + gap);
    }
  }
  if (parseInt(animationDuration) <= 0) animationDuration = config.defaultanimationDuration;
  var hasDynamic = false;
  for (var char in attrChars) {
    if (attrChars[char].atype == 'dynamic') {
      hasDynamic = true;
      break;
    }
  }
  if (hasDynamic) {
    this.animationPool.push({ data: attrChars, span: animationDuration, percent: 0 });
    if (!this.AnimationRun) {
      this.runAnimation(this);
    };
  }
  else {
    this.DrawWithoutAnimtion(attrChars, this);
  }
  this.content = attrContent;
}

module.exports = cylabel;