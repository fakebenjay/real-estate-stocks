function tooltipText(values) {
  return `<span class='quit'>x</span><div class="tooltip-container"><h2>${values.location}</h2>
  <div><strong style="background-color:#6BA292;color:white;padding:0 2px;font-size:12pt;">S&P 500 (SPX)</strong> ${numeral(values.spx).format('0,0[.]00')} (${numeral(values.spxChange).format('0[.]0%')} change since Jan. 3, 2022)</div>
  <div><strong style="background-color:#ED6A5A;color:white;padding:0 2px;">Unvaccinated:</strong> ${numeral(parseInt(values.unvaxxed)).format('0,0')} staffers (${numeral(parseInt(values.unvaxxed)/parseInt(values.total)).format('0[.]0%')} of total)</div>
  <div><strong>${numeral(values.total).format('0,0')} total staffers</strong></div>
  </div>`
}

function tipTextLine2(values) {
  var date = new Date(values.date)
  return `<span class='quit'>x</span><div class="tooltip-container">
  <div>For the week ending <strong style="font-size:14pt;">${date.toLocaleDateString("en-US", dateOptions)}</strong>, <strong style='background-color:#ed6a5a;color:white;'>&nbsp;<span style="font-size:12pt;">${numeral(values.unvaxxed).format('0[.]0')}</span> unvaccinated people per 100K&nbsp;</strong> were hospitalized, compared to <strong style='background-color:#6ba292;color:white;'>&nbsp;<span style="font-size:12pt;">${numeral(values.vaxxed).format('0[.]0')}</span> vaccinated ${values.vaxxed == 1 ? "person" : 'people'} per 100K&nbsp;</strong>.</div>
<br/><div>Someone who wasn't vaccinated this week was <strong><span style="font-size:12pt;">${numeral(parseFloat(values.unvaxxed)/parseFloat(values.vaxxed)).format('0[.]0')} times</span></strong> as likely to be hospitalized as someone who was.</div>
  </div>`
}

function tipTextLine3(values) {
  var date = new Date(values.date)

  return `<span class='quit'>x</span><div class="tooltip-container">
  <div><h2 style="font-size:14pt;text-align:center;margin-bottom:10px;">${date.toLocaleDateString("en-US", dateOptions).replaceAll('January', 'Jan.').replaceAll('February', 'Feb.')}</h2>
  <div style="text-align:center;font-size:12pt;">
  <strong style='background-color:#654f6f;color:white;'>&nbsp;S&P 500 Index (SPX)&nbsp;</strong><br/>&nbsp;${numeral(values.spx).format('0,0[.]00')} <span style="background-color:${colorScale(values.spxChange)};color:${values.spxChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.spxChange > 0 ? '+':''}${numeral(values.spxChange).format('0[.]0%')})&nbsp;</span></div><br/>
  <div style="text-align:center;font-size:10pt;">
  <strong style='background-color:#ed6a5a;color:white;'>&nbsp;Cushman & Wakefield plc (CWK)&nbsp;</strong>&nbsp;${numeral(values.cwk).format('0,0[.]00')}&nbsp;<span style="background-color:${colorScale(values.cwkChange)};color:${values.cwkChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.cwkChange > 0 ? '+':''}${numeral(values.cwkChange).format('0[.]0%')})&nbsp;</span><br/>
  <strong style='background-color:#6ba292;color:white;'>&nbsp;CBRE Group Inc (CBRE)&nbsp;</strong>&nbsp;${numeral(values.cbre).format('0,0[.]00')}&nbsp;<span style="background-color:${colorScale(values.cbreChange)};color:${values.cbreChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.cbreChange > 0 ? '+':''}${numeral(values.cbreChange).format('0[.]0%')})&nbsp;</span><br/>
  <strong style='background-color:#faa916;color:black;'>&nbsp;Jones Lang LaSalle Inc (JLL)&nbsp;</strong>&nbsp;${numeral(values.jll).format('0,0[.]00')}&nbsp;<span style="background-color:${colorScale(values.jllChange)};color:${values.jllChange > -.3 ? 'black' : 'white'};">&nbsp;(${values.jllChange > 0 ? '+':''}${numeral(values.jllChange).format('0[.]0%')})&nbsp;</span><br/>
</div>
  </div>`
}

var bisectDate2 = d3.bisector(function(d) {
  return xScale2(new Date(d.date)) - marginLeft2;
}).left

var bisectDate3 = d3.bisector(function(d) {
  return xScale3(new Date(d.date)) - marginLeft3;
}).left

function mouseoverLine(data, index) {
  var rightMargin = index == 2 ? marginRight2 : margin.right
  var leftMargin = index == 2 ? marginLeft2 : marginLeft3

  var x0 = d3.mouse(event.target)[0],
    i = index == 2 ? bisectDate2(data, x0, 1) : bisectDate3(data, x0, 1)

  var d0 = data[i - 1] !== 'dummy' ? data[i - 1] : data[i],
    d1 = i < data.length ? data[i] : data[i - 1]

  if (index == 2) {
    var d = (x0 + leftMargin) - xScale2(new Date(d0.date)) > xScale2(new Date(d1.date)) - (x0 + leftMargin) ? d1 : d0;
  } else if (index == 3) {
    var d = (x0 + leftMargin) - xScale3(new Date(d0.date)) > xScale3(new Date(d1.date)) - (x0 + leftMargin) ? d1 : d0;
  }

  var html = index == 2 ? tipTextLine2(d) : tipTextLine3(d)

  d3.selectAll(`#chart-${index} .dot`)
    .attr('r', 1)
    .lower()

  d3.selectAll(`#chart-${index} .lines-${i}`)
    .raise()

  d3.selectAll(`#chart-${index} .dot.date-${new Date(d.date).toLocaleDateString('en-us', dateOptions).split('day, ')[1].replaceAll(',', '').replaceAll(' ', '-').toLowerCase()}`)
    .attr('r', 8)
    .raise()

  d3.select(`#tooltip-${index}`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', topTT(index))
    .style('left', leftTT(index))

  d3.selectAll(`#tooltip-${index} .quit`)
    .on('click', () => {
      d3.select(`#tooltip-${index}`)
        .html("")
        .attr('display', 'none')
        .style("visibility", "hidden")
        .style("left", null)
        .style("top", null);

      d3.selectAll(`#chart-${index} .lines-${i}`)
        .raise()

      d3.selectAll(`#chart-${index} .dot`)
        .lower()
    })
}

function mouseover(d, i) {
  var html = tooltipText(d)

  d3.select(`#tooltip-${i}`)
    .html(html)
    .attr('display', 'block')
    .style("visibility", "visible")
    .style('top', () => {
      return topTT(i)
    })
    .style('left', () => {
      return leftTT(i)
    })

  d3.selectAll('text')
    .raise()

  d3.select(`#tooltip-${i} .quit`)
    .on('click', () => {
      d3.select(`#tooltip-${i}`)
        .html("")
        .attr('display', 'none')
        .style("visibility", "hidden")
        .style("left", null)
        .style("top", null);
    })
}

function mouseout(i) {
  if (window.innerWidth > 767) {
    d3.select(`#tooltip-${i}`)
      .html("")
      .attr('display', 'none')
      .style("visibility", "hidden")
      .style("left", null)
      .style("top", null);

    d3.selectAll('.' + event.target.classList[0])
      .style('stroke-width', '0.5')

    d3.selectAll(`#chart-${i} .lines-${i}`)
      .raise()

    d3.selectAll(`#chart-${i} .line`)
      .raise()

    d3.selectAll(`#chart-${i} .dot`)
      .lower()
  }
}

function topTT(i) {
  var offsetParent = document.querySelector(`#chart-${i} .chart`).offsetParent
  var offY = offsetParent.offsetTop
  var cursorY = 5

  var windowWidth = window.innerWidth
  var ch = document.querySelector(`#tooltip-${i}`).clientHeight
  var cy = d3.event.pageY - offY
  var windowHeight = window.innerHeight
  if (windowWidth > 767) {
    // if (ch + cy >= windowHeight) {
    //   return cy - (ch / 2) + "px"
    // } else {
    return cy - 28 + "px"
    // }
  }
}

function leftTT(i) {
  var offsetParent = document.querySelector(`#chart-${i} .chart`).offsetParent
  var offX = offsetParent.offsetLeft
  var cursorX = 5

  var windowWidth = window.innerWidth
  var cw = document.querySelector(`#tooltip-${i}`).clientWidth
  var cx = d3.event.pageX - offX
  var bodyWidth = document.querySelector(`#chart-${i} .chart`).clientWidth

  if (windowWidth > 767) {
    if (cw + cx >= bodyWidth) {
      document.querySelector(`#tooltip-${i}`).className = 'my-tooltip box-shadow-left'
      return cx - cw - cursorX + "px"
    } else {
      document.querySelector(`#tooltip-${i}`).className = 'my-tooltip box-shadow-right'
      return cx + cursorX + "px"
    }
  }
}