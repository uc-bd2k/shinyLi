DRG = function() {
// define('dose_response_grid', ['jquery', 'jquery_throttle_debounce', 'd3'],
       // function(jQuery, jquery_td, d3) {

  function lineno () {
    return new Error().stack.split('\n')[2].split(':')[3];
  }

  var elapsed = (function () {
    function time () {
      return new Date().getTime();
    }
    function elapsed () {
      var now = time(),
          ret = now - elapsed.then;
      elapsed.then = now;
      return ret;
    }
    elapsed.init = function () {
      elapsed.then = time();
    };
    elapsed.log = function (msg) {
      if (arguments.length == 0) {
          msg = '';
      }
      else {
          msg += ': ';
      }
      console.log(msg + elapsed());
    };
    elapsed.init();
    return elapsed;
  }());

  // the following line may look like a no-op but it actually replaces
  // a percentage with a fixed pixel position, in order to eliminate a
  // visual "bounce" as the viewport height changes during loading.

/*
  (function(){
     var $loading = $(divbase+'#loading > div');
     $loading.css({top: parseInt($loading.css('top'), 10),
                   'margin-left': $loading.offset().left,
                   'margin-right': ''});
   }());
*/
  function update_min_height () {
    var $main = $(divbase+'.main-content');
    $main.css('min-height',
              $(divbase+'.vfloat').innerHeight() +
              parseInt($main.css('padding-top'), 10) +
              parseInt($main.css('padding-bottom'), 10));
  }

  function install_handlers () {

    (function(){
      var $main = $(divbase+'.main-content'),
          $slider = $(divbase+'.slider'),
          pt = parseInt($main.css('padding-top'), 10),
          pb = parseInt($main.css('padding-bottom'), 10),
          $vf = $(divbase+'.vfloat');

      $(divbase+'.pulldown').css('margin-bottom', parseInt($slider.css('padding-top'), 10));
      $vf.css('top', pt);
    }());

    var update_scroll_handler = function () {};

    var slide_props = (function () {

      var $main = $(divbase+'.main'),
          $showhide = $main.find('.show-hide'),
          $slider = $main.find('.slider'),
          $pulldown = $slider.find('.pulldown'),
          $info = $slider.find('.pulldown-content'),
          $content = $slider.find('.main-content'),
          rect = function ($sel) { return $sel.get(0).getBoundingClientRect(); },
          slider_top = rect($slider).top, // slow!
          offset_0 = Math.abs(slider_top - rect($pulldown).top),
          offset_1 = Math.abs(slider_top - rect($info).top),
          top_open = -Math.ceil(offset_1),
          last_mt = NaN;

      function slide_props (open) {
        var mt = open ? top_open
                      : -Math.ceil(offset_0 + $pulldown.innerHeight());
        return {'margin-top': mt};
      }

      function slide (open, now) {
        var props = slide_props(open),
            mt = props['margin-top'],
            cc = open ? ['open', 'closed'] : ['closed', 'open'];
        if (mt === last_mt) { return; }
        last_mt = mt;

        function set_classes () {
          $main.removeClass(cc[1]).addClass(cc[0]);
        }

        if (now) {
          set_classes();
          $pulldown.css(props);
          update_scroll_handler();
        }
        // else if (open) {
        //   set_classes();
        //   $pulldown.animate(props, 200, update_scroll_handler);
        // }
        else {
          $pulldown.animate(props, 200, function () {
            set_classes();
            update_scroll_handler();
          });
        }
      }

      $showhide.click(function () {
                  slide(!$main.hasClass('open'));
                });
      slide(false, true);
      return slide_props;
    }());

    // exposing this updater function is not necessary for this
    // demo, but it will be necessary in the general case;
    update_scroll_handler = (function () {
        var $w = $(window),
            $main_content = $(divbase+'.main-content'),
            // $fl: floating element
            $fl = $main_content.find('.vfloat'),
            // pt: padding-top; pb: padding-bottom
            pt = parseInt($main_content.css('padding-top'), 10), // slow
            pb = parseInt($main_content.css('padding-bottom'), 10),
            // ptvp: top padding relative to viewport (i.e. $fl will
            // stop at ptvp from the top of the viewport)
            ptvp = 0,
            // ah: available height
            ah,
            // st0 and st1 are the two critical values (of the value returned by
            // $w.scrollTop()) that govern the behavior upon scrolling of $fl
            mt,
            st0,
            st1,
            dy,
            state,
            last_i = -2,
            last_t2 = null,
            update_critical_values = function () {
                var t0, t1, t2;
                ah = $main_content.innerHeight() - (ptvp + pb);
                mt = $main_content.offset().top;
                dy = (pt - ptvp);
                st0 = mt + dy;
                st1 = mt + (ah - $fl.innerHeight());

                t0 = pt;
                t1 = t0 - dy;
                t2 = t0 + st1 - st0;

                state = [{top: t0, position: 'absolute'},
                         {top: t1, position: 'fixed'},
                         {top: t2, position: 'absolute'}];

                if (t2 !== last_t2 &&
                    last_i !== -2 &&
                    st1 < $w.scrollTop()) {
                  handle_scrolling();
                }

                last_t2 = t2;
                last_i = -1;
            },
            handle_scrolling = function () {
                var st = $w.scrollTop(),
                    i = st < st0 ? 0 : st <= st1 ? 1 : 2;
                if (last_i !== i) {
                    $fl.css(state[i]);
                    last_i = i;
                }
            };
        update_critical_values();
        handle_scrolling();
        $w.scroll(handle_scrolling);
        return update_critical_values;
    }());


    (function () {

      var $window = $(window),
          $main = $(divbase+'.main'),
          $body = $(divbase+'body'),
          $showhide = $main.find('.show-hide'),
          $slider = $main.find('.slider'),
          $pulldown = $main.find('.pulldown'),
          wlim = parseInt($pulldown.css('max-width'), 10) +
                 parseInt($slider.css('padding-left'), 10) +
                 parseInt($slider.css('padding-right'), 10) +
                 parseInt($main.css('padding-left'), 10) +
                 parseInt($main.css('padding-right'), 10),
          dx = ($main.get(0).getBoundingClientRect().right -
                $main.find('.pulldown-content')
                     .get(0).getBoundingClientRect().right) -
               (Math.max(0, $slider.innerWidth() - wlim)/2),
          init = true,
          resizing = false;

      function resize_start () {
        if (init || !$main.hasClass('open')) {
          $pulldown.css('display', 'none');
        }
        resizing = true;
      }
      function resize_end () {
        if (init || !$main.hasClass('open')) {
          $pulldown.css({display: '', top: -999999});
          $pulldown.css(slide_props(false));
          $pulldown.css({top: 0});
        }
        resizing = false;
      }
      function resize_handler () {
        if (!resizing) { return; }
        $showhide.css('right',
                      (Math.max(0, $slider.innerWidth() - wlim))/2 + dx);
        update_scroll_handler();
        // set_bodywidth();
      }

      $window.resize($.debounce(500, true, resize_start));
      $window.resize(resize_handler);
      $window.resize($.debounce(500, false, resize_end));
      $main.removeClass('open').addClass('closed');

      resize_start();
      resize_handler();
      resize_end();
      init = false;
    }());

    var time = (function () {
      var start,
          ret     = function () { return new Date().valueOf(); };
      ret.started = function () { return start; };
      ret.elapsed = function () { return ret() - start; };
      ret.reset   = function () { start = ret();
                                  return start; };
      ret.reset();
      return ret;
    }());
  } // end of install_handlers

  function dostage_1000 (data, grid, paths) {
    var todo = paths[0],
        stride = 200,
        get_xy = mk_get_xy(),
        pgetters = PARAMS.map(get);
        
    function inner () {
      if (todo.length > 0) {
        elapsed.init();
        var q = d3.selectAll(todo.slice(0, stride));
        q.datum(function (d) {
           var params = pgetters.map(apply(d))
                                .map(function (d) { return +d; });
	   // console.log("params="+params);
	   // console.log("params="+JSON.stringify(params));
           return   params.every(isFinite)
                  ? get_xy(MK_FN.apply(null, params), XRANGE)
                  : get_xy(mk_flat.apply(null, params), XRANGE);
                  // : [];
         });
         todo = todo.slice(stride);
         setTimeout(inner, elapsed());
         return;
      }

      dostage_2000(data, grid, paths);
    }
    setTimeout(inner, 0);
  } // dostage_1000

  function dostage_2000 (data, grid, paths) {
    var svg = grid.select('svg'),
        voodoo = 3,
        text_height = svg.select('text').node().getBBox().height + voodoo,
        domains = d3.transpose(paths.data()
                                    .map(d3.transpose)
                                    .filter(function (p) {
                                      return p.length > 0;
                                     }))
                    .map(function (a) {
                       return pad_interval(d3.extent(d3.merge(a)),
                                           PLOT_RANGE_PADDING);
                     }),
        ranges = [[0, parseInt(svg.attr('width'))],
                  [parseInt(svg.attr('height')), text_height]],
        line = linedrawer(domains, ranges);

// mk
	grid.selectAll('svg').each(function(d, i) { 
		var rect=this.getBBox();
		rect.width=parseInt(svg.attr('width'));
		rect.height=parseInt(svg.attr('height'));
		var selection = d3.select(this);	

		var mid=line([[0,0]]);
		var last=0;
		var mid_coord="";
		if (mid.slice(-1)=="Z") { mid_coord=mid.slice(1,-1); }
		else { mid_coord = mid.slice(1); }
		var coord = mid_coord.split(',');
		var mid_x=coord[0];
		var mid_y=coord[1];
		// console.log("line="+mid+" coord="+mid_coord);

		// if (parseInt(mid_x)>=0 && parseInt(mid_x)<=parseInt(svg.attr('width'))) 
		{
		// X axis
		d3.select(this).append("line")
			.attr("x1", rect.x+rect.width)
			.attr("y1", mid_y) // rect.y + rect.height-4-30)
			.attr("x2", rect.x+2)
			.attr("y2", mid_y) // rect.y + rect.height-4-30)
			.attr("stroke-width", 0.5)
			.attr("stroke", "black");
		}

		// Y axis
		// if (parseInt(mid_y)>=0 && parseInt(mid_y)<=parseInt(svg.attr('height'))) 
		{
		d3.select(this).append("line")
			.attr("x1", mid_x) // rect.x+4)
			.attr("y1", rect.y + rect.height-4)
			.attr("x2", mid_x) // rect.x+4)
			.attr("y2", rect.y+15)
			.attr("stroke-width", 1)
			.attr("stroke", "black")
			.attr("class", "line");
		}

	});

    var todo = paths[0],
        stride = 200;
    function inner () {
      if (todo.length) {
        elapsed.init();
        d3.selectAll(todo.slice(0, stride)).attr('d', line);
        todo = todo.slice(stride);
        setTimeout(inner, elapsed());
      }
      else {
        dostage_3000(data, grid);
      }
    }
    setTimeout(inner, 0);
  }

  function dostage_3000 (data, grid) {
    var argmax =  FACTORS
                 .map(function (f) {
                   return [f, levels(data, f)];
                  })
                 .sort(function (a, b) {
                   return b[1].length - a[1].length;
                  })[0],
        maxfactor = argmax[0],
        classes = argmax[1].map(function (lvl) {
                    return GET_CLASS(maxfactor, lvl);
                  });

    $(divbase)
      .append($('<div id="grid-off-stage" class="track-container">' +
                  '<div class="list-container-base">' +
                    '<ul></ul>' +
                  '</div>' + 
                '</div>'));



    // instrument button
    var nfactors = FACTORS.length,
        pick = -1;

    $(divbase+'#toggle button')
      .click(function() {
         var factor = FACTORS[pick = (pick + 1) % nfactors],
             other = FACTORS[(pick + 1) % nfactors];
         set_track(data, other);
         var lvls = levels(data, factor),
             nlevels = lvls.length,
             classes = lvls.map(function (lvl) { return GET_CLASS(factor, lvl) });

         grid.selectAll('g')
             .each(function (_, i) {
                var g = this;
                setTimeout(function(){
                    var label = '', cls;
                    if (i < nlevels) {
		      if (param_showfactorname==1) {
			 label = factor + ': ';
		      } else {
			 label = ''
		      }
                      label += lvls[i];
                      cls = classes[i];
                      grid.selectAll('.' + cls)
                          .each(function(){
                            this.parentNode.removeChild(this);
                            g.appendChild(this)
                          });
                      unhighlight(cls);
                    }
                    d3.select(g).select('text')
                                .text("")
				// working .on("click", function() { window.open("http://google.com"); })
				.append("a")
			    	// .attr({"xlink:href": "#"})
			    	// .on("mouseover", function(d, i){ d3.select(this) .attr({"xlink:href": "http://example.com/" + d + "&" + i + "&" + lvls[i] }); })
				// .on("click", clicked)
                                .text(label)
                                .attr('fill', '#000000')
				.append("svg:title").text(function(d) { return /*d.x*/encodeURIComponent(factor)+"="+encodeURIComponent(label); })
				// .on("click", function() { window.open("http://google.com"); })
				; 
                }, 10*i);
              });

         $(divbase+'.current-view').text(factor);
         $(divbase+'.other-view').text(other);

       });

    $(divbase+'#toggle button').click();

    $(divbase+'#reset').css('display', '');
    $(divbase+'#reset').click(function () {
      reset();
      $(this).prop('disabled', true);
    });

    // ---------------------------------------------------------------------------
    // in d3.tsv(INPUT_FILE, function(error, data) { ... }

    //install_handlers();
    $(divbase+'.slider').css('visibility', 'visible');
    $(divbase+'#loading').fadeOut(80);

    // ----------------------------------------------------------------------

    // in d3.tsv(INPUT_FILE, function(error, data) { ... }
    function set_track (data, factor) {
      // var sbmargin = 25;
      var borderwidth = 1;

      $(divbase+'#track .list-container').css({visibility: 'hidden'});

      reset();

      var ul = d3.select(divbase+'#track .list-container ul');

      // ul.style({display: '',
      //           width: ''});

      // var lis = ul.selectAll('li')
      //             .style('display', 'none');

      var title = ul.select('.title')
                    .text(factor)
                    .style('font-weight', 'bold');

      var items = levels(data, factor)
                    .map(function (lvl) {
                       return { text: lvl, 'class': GET_CLASS(factor, lvl) };
                     });

      // var bbmargin = 20;
      // $(divbase+'.vfloat .track-container').css({'padding-left': bbmargin + 'px',
      //                            'padding-right': bbmargin + 'px'});
      // var width = $(divbase+'.vfloat').innerWidth() - (2 * bbmargin);

      var width = $(divbase+'.vfloat').innerWidth(); //slow (innerWidth)
      // console.log(width - sbmargin);
      // populate_list(ul, items, width - sbmargin);
      populate_list(ul, items, width - 2 * borderwidth);
      $(divbase+'#track .list-container').css({visibility: 'visible'});

      $(divbase+'#track .list-container').css({width:
                                       2 * borderwidth +
                                       $(divbase+'#track .list-container > ul').width(),
                                       visibility: 'visible'});
      update_min_height();
      return;
    }

    // in d3.tsv(INPUT_FILE, function(error, data) { ... }
    function highlight (cls) {
      refresh();
      d3.select(divbase+'#grid :first-child')
        .selectAll('.' + cls)
        .classed('unhighlit', false)
        .style('stroke', color(current_color_index))
        .each(function () {
                this.parentNode.appendChild(this);
              });
    }

    // in d3.tsv(INPUT_FILE, function(error, data) { ... }
    function unhighlight (cls) {
      d3.selectAll(divbase+"." + cls)
        .classed('unhighlit', true)
        .style('stroke', '');
      refresh();
    }

    // in d3.tsv(INPUT_FILE, function(error, data) { ... }
    function refresh () {
      d3.selectAll(divbase+'path:not(.unhighlit)')
        .each(function () {
                this.parentNode.appendChild(this);
              });
    }

    // in d3.tsv(INPUT_FILE, function(error, data) { ... }
    function reset () {
      $(divbase+'#track .list-container').find('li')
                                 .css({'background-color':''})
                                 .removeClass('picked');
      current_color_index = 0;
      d3.selectAll(divbase+'#grid :first-child path:not(.line)')
        .each(function () {
           d3.select(this).classed('unhighlit', true)
                          .style('stroke', '');
        });
    }

    // in d3.tsv(INPUT_FILE, function(error, data) { ... }
    function populate_list (list, data, max_width, callback) {
      var n = data.length,
          min_rows = 3,
          hpadding = 10,
          hmargin = 10,
          borderwidth = 1,
          items,
          width,
          sentinel = String.fromCharCode(29),
          column_order = true;

      if (column_order) {
        _populate_list_0(d3.select(divbase+'#grid-off-stage ul'), data);

        var all_widths = d3.select(divbase+'#grid-off-stage')
                           .selectAll('li')
                           .filter(function () {
                              return d3.select(this).style('display') !== 'none';
                            })[0]
                           .map(get_width)
                           .sort(d3.descending),
            min_unpadded_colwidth = acceptable_width(all_widths, 1/(min_rows * 2)),
            min_colwidth = min_unpadded_colwidth + (2 * borderwidth) + hpadding,
            // max_ncols = column_order ? 1 + ~~((n - 1)/min_rows)
            //                          : ~~((n - 1)/(min_rows - 1)),
            max_ncols = 1 + ~~((n - 1)/min_rows),
            ncols = Math.max(1, Math.min(max_ncols,
                                         //~~Math.sqrt(n),
                                         ~~(max_width/(min_colwidth + hmargin)))),
            nrows = Math.max(min_rows, Math.ceil(n/ncols)),
            tmp = Math.ceil(n/nrows);

        if (ncols > tmp) {
           ncols = tmp;
        }

        var colwidth = (~~(max_width/ncols)) - hmargin,
            width = ncols * (colwidth + hmargin);

        items = d3.merge(columnate(data, ncols));
      }
      else {
        items = data;
        width = max_width;
      }

      _populate_list_0(list, items, handlers);

      list.style('width', width + 'px');
      list.selectAll('li')
          .style('border-width', borderwidth + 'px')
          .style('padding', '0 ' + (hpadding/2) + 'px')
          .style('margin', '0 ' + (hmargin/2) + 'px')
          .style('width', column_order ? (colwidth + 'px') : '');

      // in function populate_list (list, data, max_width, callback) { ... }
      function handlers () {
            $(this).hover(function () {
                var $li = $(this);
                if ($li.hasClass('picked')) return;
                $li.css({'background-color': color(current_color_index).toString()});
                highlight(d3.select(this).datum()['class']);
              },
              function () {
                var $li = $(this);
                if ($li.hasClass('picked')) return;
                $li.css({'background-color': ''});
                unhighlight(d3.select(this).datum()['class']);
              })
                   .click(function (event) {
                if (event.which !== 1) {
                  return;
                }
                var $li = $(this);
                if (!$li.hasClass('picked')) {
                  $li.css({'background-color': color(current_color_index).toString()});
                  $li.addClass('picked');
                  $(divbase+'#reset').prop('disabled', false);
                  current_color_index += 1;
                }
                event.stopPropagation();
              })
                   .dblclick(function (event) {
                if (window.getSelection) {
                  window.getSelection().removeAllRanges();
                }
                else if (document.selection) {
                  document.selection.empty();
                }
                event.stopPropagation();
              });
      }

      // in function populate_list (list, data, max_width, callback) { ... }
      function get_width (t) {
        return Math.ceil(t.getBoundingClientRect().width);
      }

      // in function populate_list (list, data, max_width, callback) { ... }
      function _populate_list_0 (list, data, callback) {
        var lis0 = list.selectAll('li'),
            lis = lis0.data(data),
            enter = lis.enter(),
            exit = lis.exit();
        if (callback === undefined) {
          callback = function () {};
        }
        exit.style('display', 'none');
        enter.append('li')
             .each(callback);

        lis.text(function (d) { return d === sentinel ? 'null' : d.text; })
           .style('display', '')
           .style('visibility',
                  function (d) { return d === sentinel ? 'hidden' : 'visible'; });
      }

      // in function populate_list (list, data, max_width, callback) { ... }
      function acceptable_width (descending_widths, f) {
        // f represents the maximum acceptable number of entries in
        // descending_widths that are strictly greater than the value
        // returned by this function
        return descending_widths[Math.floor(descending_widths.length * f)];
      }

      // in function populate_list (list, data, max_width, callback) { ... }
      function columnate (array, ncols) {
        var nrows = Math.max(min_rows, Math.ceil(array.length/ncols));
        return d3.transpose(chunk(pad_array(array, nrows * ncols), nrows));
      }

      // in function populate_list (list, data, max_width, callback) { ... }
      function pad_array (array, n) {
        return array.concat(d3.range(n - array.length)
                              .map(function () { return sentinel; }));
      }

      // in function populate_list (list, data, max_width, callback) { ... }
      function chunk (array, chunksize) {
        return d3.range(array.length/chunksize)
                 .map(function (i) {
                    var s = i * chunksize;
                    return array.slice(s, s + chunksize);
                  });
      }
    } // function populate_list (list, data, max_width, callback) { ... }
  } // dostage_3000

  function color (i) {
    var
      mult = 360,
      start = 2/3,
      step = Math.sqrt(5) - 2;
    return d3.hsl(mult * ((start + i * step) % 1), 0.6, 0.6);
  }

  function get (key) {
    return function (d) { return d[key]; }
  }

  function proj (aoo, key) {
    return aoo.map(get(key));
  }

  function levels (data, factor) {
    return d3.set(proj(data, factor)).values();
  }

  function build_grid (nvps, shape) {
    var table = d3.select(divbase+'#grid').insert('div', ':first-child');
    table
        .selectAll('svg')
        .data(d3.range(nvps))
        .enter()
      .append('svg')
        .attr(shape)
      .append('g')
      .append('text')
        .text('placeholder')
        .attr('fill', '#ffffff')
        .attr('x', 0)
        .attr('y', function () {
           return this.getBBox().height;
         });

    // table.style('visibility', 'visible');
    return table;
  }

  function apply (d) {
    return function (g) { return g(d); };
  }

  function mk_sigmoids(log10ec50, rcvinf, hc) {
    var pow = Math.pow;
    var Q = pow(10, log10ec50 * hc);
    var P = Q * (1 - rcvinf);
    return function(log10dose) {
      return P/(Q + pow(10, log10dose * hc)) + rcvinf;
    };
  }

  function mk_flat(log10ec50, rcvinf, hc) {
    // assumes log10ec50 is Inf and changes the function to y=rcvinf;
    // FIXME: more checking...
    return function() {
      return rcvinf;
    };
  }

  function pad_interval(interval, padding) {
    return [interpolate(interval, -padding),
            interpolate(interval, 1 + padding)];
  }

  function interpolate(interval, t) {
    return interval[0] * (1 - t) + interval[1] * t;
  }

  function linedrawer(srcs, tgts) {
    var xyfns = [0, 1].map(function (i) {
      var s = d3.scale.linear().domain(srcs[i]).range(tgts[i]),
          fmt = d3.format('.1f');
      return function (d) { return fmt(s(d[i])); }
      /*
      return function (d) { 
		var ret=fmt(s(d[i])); 
		return ret; }
		*/
    });
    return d3.svg.line().x(xyfns[0]).y(xyfns[1]);
  }

  function vpadding ($e) {
    var extra_padding = 20;
    return Math.ceil($e.get(0).getBoundingClientRect().height + extra_padding) + 'px';
  }

  function mk_get_class () {
    // mk_get_class = undefined;
    var memo = d3.map(),
        sep = String.fromCharCode(29),
        prefix = '_',
        next = -1;
    return function (factor, level) {
      var key = factor + sep + level;
      return   memo.has(key)
             ? memo.get(key)
             : memo.set(key, prefix + (next += 1));
    }
  }

  function mk_get_xy() {
    var NPTS = 100,
        mesh = d3.range(NPTS),
        scale = d3.scale
                  .linear()
                  .domain([0, NPTS - 1]);

    return function (fn, xrange) {
      var xs = mesh.map(scale.range(xrange)),
          ys = xs.map(fn);
      return ys.every(isFinite) ? d3.zip(xs, ys) : [];
    }
  }

  function label_dom (node, plabel, i) {
    if (plabel === undefined) { plabel = ''; }
    if (i === undefined) { i = 1; }
    var $node = $(node),
        title = $node.prop('title'),
        id = $node.prop('id'),
        clas = $node.prop('class'),
        tag = $node.prop('tagName'),
        sel;

    if (tag === undefined) { return; }

    if (id !== '') {
      sel = '#' + id;
    }
    else {
      sel = plabel === '' ? '' : plabel + ' > ';
      sel += tag.toLowerCase();
      if (clas !== '') {
        sel += clas.toString()
                   .split(' ')
                   .map(function (c) { return '.' + c; })
                   .join('');
      }
      sel += ':nth-child(' + i + ')';
    }

    if (title === '') {
      $node.prop('title', sel)
    }

    node = node.firstChild;
    var j = 0;
    while (node) {
      label_dom(node, sel, j);
      node = node.nextSibling;
      j += 1;
    }
  }

  // function walk_dom (node, func, i) {
  //   if (i === undefined) { i = 0; }
  //   func(node, i);
  //   node = node.firstChild;
  //   var j = 0;
  //   while (node) {
  //     walk_dom(node, func, j);
  //     node = node.nextSibling;
  //     j += 1;
  //   }
  // }

  // label_dom($(divbase+'body').get(0));
  
  var PLOT_RANGE_PADDING = 0.02,
      // XRANGE = [-10.5, -2],
      XRANGE = [-5, 5],
      MK_FN = mk_sigmoids,
      // SHAPE = {width: 125, height: 75},
      SHAPE = {width: 200, height: 125},
      PARAMS = 'log10[EC50]	Einf	HillSlope'.split('\t'),
      // FACTORS = 'cell line	drug'.split('\t'),
      FACTORS = 'drug	cell line'.split('\t'),
      GET_CLASS = undefined,
      hide_toggle = 0,
      current_color_index = 0,
      param_showfactorname = 0,
      divbase = ''; // #dose-response-grid-main

this.runLiDoseResponseGrid=function(INPUT_FILE, data, xmin, xmax, factors, toggle, showfactorname, _divbase) 
{
	divbase='#'+_divbase+' ';
	console.log('divbase='+divbase);

        $(divbase+'#loading > div').text( "loading... " );

	var destination = $(divbase).offset();
	$(divbase+'#loading').css('position','absolute');
	$(divbase+'#loading').css({top: destination.top, left: destination.left});

	$(divbase+'#loading').height($(divbase).height);
	$(divbase+'#loading').width($(divbase).width);

        $(divbase+'#loading').fadeIn(80);

	$(divbase+'#loading').css('background-color','#4d4d4d');
  	$(divbase+'#loading').css('opacity','0.9');
  	$(divbase+'#loading').css('filter','alpha(opacity=90)');


	if (xmin<xmax) XRANGE=[xmin, xmax];

	if ( factors.length === undefined || (factors.length < 1) ) {
		// keep factors default
      		FACTORS = 'drug	cell line'.split('\t');
		if (toggle === undefined) $(divbase+"#toggle").show();
	} else if (factors.length == 1) {
		FACTORS = factors;
		if (toggle === undefined) $(divbase+"#toggle").hide();
	} else {
		FACTORS = factors;
		if (toggle === undefined) $(divbase+"#toggle").show();
	}
	
	if (toggle !== undefined)  {
		if (toggle == 1) { $(divbase+"#toggle").show(); }
		else { $(divbase+"#toggle").hide(); }
	}

      if (showfactorname == 1) param_showfactorname=1;

      GET_CLASS = mk_get_class();
 // find id=grid-off-stage and class=track-container and remove
 // find id=grid and class=svg-table and empty it
 /*
  if(document.getElementById("grid-off-stage") !== null) {
     // $( ".track-container" ).remove();
     $( "#grid-off-stage" ).remove();
  }
  */
  $(divbase+".svg-table" ).empty();
  
  function d3_json(error, data) {
    // console.log("data="+JSON.stringify(data));
    // console.log("d3_json="+JSON.stringify(data.factors));
    console.log("factors="+JSON.stringify(FACTORS));
    var params_set,
        fgetters,
        grid;

    params_set = d3.set(PARAMS);
    fgetters = FACTORS.map(get);
    grid = build_grid(d3.max(FACTORS.map(function (f) {
                 return levels(data, f).length;
               })), SHAPE);

    current_color_index = 0;

    $(divbase+'.slider').css('visibility', 'hidden');
    var paths = grid.select('g')
                    .selectAll('path')
                    .data(data)
                    .enter()
                  .append('svg:path');

    var todo = paths[0],
        stride = 200;

    function inner () {
      if (todo.length > 0) {
        elapsed.init();
        var q = d3.selectAll(todo.slice(0, stride));
        
        q.each(function (d, i) {
             var classes = d3.zip(FACTORS, fgetters.map(apply(d)))
                             .map(function (args) {
                                return GET_CLASS.apply(null, args);
                              })
                             .sort()
                             .join(' ');
             d3.select(this).classed(classes, true);
           });
          
        todo = todo.slice(stride);
        setTimeout(inner, elapsed());
        return;
      }
      dostage_1000(data, grid, paths);
    }

    setTimeout(inner, 0);
  }; // closing of d3.tsv(INPUT_FILE, function(error, data) { ... }

  // console.log("input_file="+INPUT_FILE);

  if (INPUT_FILE=="") { 
     console.log("data input");
     var error=null;
     d3_json(error, data);
  } else {
     console.log("input_file="+INPUT_FILE);
     d3.tsv(INPUT_FILE, d3_json);
  }

}

/*
jQuery(document).ready(function ($) 
{
   run_d3_input('dose_response_data.tsv');
});

});
*/

}
