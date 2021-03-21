"use strict";
function coinStat() {
  var config = { attributes: true };
  var currencies = {};
  function createWidget(placeHolder) {
    var globalCoinId = void 0;
    var globalTimeInterval = "24h";
    var globalData = [];
    var candleChartData = [];
    var candleChartMax = void 0;
    var candleChartMin = void 0;
    var globalCurrency = "USD";
    var globalColors = {};
    var isLineChart = true;
    var diffPercent = void 0;
    (function () {
      var coinId = placeHolder.getAttribute("coin-id");
      var width = placeHolder.getAttribute("width");
      var height = placeHolder.getAttribute("chart-height");
      var localeAtt = placeHolder.getAttribute("locale");
      var type = placeHolder.getAttribute("type");
      var currency = placeHolder.getAttribute("currency");
      var backgroundColor = placeHolder.getAttribute("bg-color");
      var statusUpColor = placeHolder.getAttribute("status-up-color");
      var statusDownColor = placeHolder.getAttribute("status-down-color");
      var textColor = placeHolder.getAttribute("text-color");
      var buttonsColor = placeHolder.getAttribute("buttons-color");
      var chartGradientFrom = placeHolder.getAttribute("chart-gradient-from");
      var chartGradientTo = placeHolder.getAttribute("chart-gradient-to");
      var chartColor = placeHolder.getAttribute("chart-color");
      var btcColor = placeHolder.getAttribute("btc-color");
      var ethColor = placeHolder.getAttribute("eth-color");
      var gridsColor = placeHolder.getAttribute("candle-grids-color");
      var chartLabelBackground = placeHolder.getAttribute("chart-label-background");
      var borderColor = placeHolder.getAttribute("border-color");
      var disableCredits = placeHolder.getAttribute("disable-credits");
      globalCurrency = currency;
      globalCoinId = coinId;
      var colors = {
        background: backgroundColor,
        statusDown: statusDownColor,
        statusUp: statusUpColor,
        buttons: buttonsColor,
        text: textColor,
        chartLabelBackground: chartLabelBackground,
        chartBg: "transparent",
        chartTextColor: "#fff",
        pointsColor: "#fea856",
        areaColorFrom: chartGradientFrom,
        areaColorTo: chartGradientTo,
        chartColor: chartColor,
        gridsColor: gridsColor,
        themeI: "rgb(255,255,255)",
        theme: "rgb(28,27,27)",
        btc: btcColor,
        eth: ethColor,
        border: borderColor,
      };
      globalColors = colors;
      var widgetContainer = document.createElement("div");
      setLoader(widgetContainer);
      var chartId = Math.random().toString(7);
      widgetContainer.style.cssText =
        "\n      box-sizing: border-box;\n      background-color: " +
        colors.background +
        ";\n      border: solid 1px " +
        colors.border +
        ";\n      max-width: " +
        width +
        "px;\n      border-radius: 20px;\n      font-family: Roboto, Arial, Helvetica, sans-serif !important;\n    ";
      widgetContainer.appendChild(createStyle(colors));
      getPriceData(coinId, function (coinData) {
        getData(coinId, function (data) {
          widgetContainer.appendChild(createFirstRow(coinData, colors, type));
          widgetContainer.appendChild(createChartContainer(chartId, colors));
          removeLoader(widgetContainer);
          globalData = data;
          var checkboxesSection = createCheckboxesSection(localeAtt, height, chartId, type);
          var footerBlock = document.createElement("div");
          footerBlock.style.cssText =
            "\n          display: flex;\n          justify-content: space-around;\n          flex-wrap: wrap;\n          max-width: 90%;\n          margin: 0 auto 20px;\n        ";
          footerBlock.appendChild(
            createButtonsSection(checkboxesSection, height, coinId, localeAtt, chartId, type)
          );
          if (type === "large" && isLineChart) {
            footerBlock.appendChild(checkboxesSection);
          }
          widgetContainer.appendChild(footerBlock);
          if (placeHolder.children.length === 1) {
            placeHolder.removeChild(placeHolder.lastChild);
          }
          var container = document.createElement("div");
          container.appendChild(widgetContainer);
          if (!disableCredits) {
            container.appendChild(createCredits(colors.text));
          }
          placeHolder.appendChild(container);
          createChart(checkboxesSection, height, "24h", chartId, type);
        });
      });
    })();
    function commarize(price) {
      if (price >= 1e3) {
        var units = ["k", "M", "B", "T"];
        var unit = Math.floor((price.toFixed(0).length - 1) / 3) * 3;
        var num = (price / ("1e" + unit)).toFixed(2);
        var unitname = units[Math.floor(unit / 3) - 1];
        return num + unitname;
      }
      return price.toLocaleString();
    }
    function calculateDiff(x, y) {
      var result = ((y - x) / ((y + x) / 2)) * 100;
      return result;
    }
    function getData(coinId, callback) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "24h";
      return fetch("https://api.coin-stats.com/v2/coinchart/" + coinId + "?type=" + type)
        .then(function (res) {
          return res.json();
        })
        .then(function (res) {
          var length = res.data.length - 1;
          diffPercent = calculateDiff(res.data[0][1], res.data[length][1]);
          updatePercentBlock();
          callback(res.data);
        });
    }
    function getCandleChartData(id, callback) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "24h";
      var currency = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "USD";
      candleChartMax = -Infinity;
      candleChartMin = Infinity;
      return fetch(
        "https://api.coin-stats.com/v2/coinchart/" + id + "/candle?type=" + type + "&currency=" + currency
      )
        .then(function (res) {
          return res.json();
        })
        .then(function (res) {
          var reorderIndexes = [0, 1, 3, 4, 2, 5];
          var parsedData = res.candleChart.map(function (el) {
            var result = reorderIndexes.map(function (i) {
              return el[i];
            });
            result[0] *= 1e3;
            if (globalCurrency !== "USD" && currency === "USD") {
              var rate = currencies[globalCurrency].rate;
              result[1] *= rate;
              result[2] *= rate;
              result[3] *= rate;
              result[4] *= rate;
            }
            if (result[2] > candleChartMax) {
              candleChartMax = result[2];
            }
            if (result[3] < candleChartMin) {
              candleChartMin = result[3];
            }
            return result;
          });
          var length = res.candleChart.length - 1;
          diffPercent = calculateDiff(res.candleChart[0][1], res.candleChart[length][1]);
          updatePercentBlock();
          candleChartData = parsedData;
          callback();
        });
    }
    function getPriceData(coinId, callback) {
      return fetch("https://api.coin-stats.com/v2/coins/" + coinId)
        .then(function (res) {
          return res.json();
        })
        .then(function (res) {
          return callback(res);
        });
    }
    function createCredits(textColor) {
      var credits = document.createElement("div");
      var anchor = document.createElement("a");
      anchor.href = "http://coinstats.app";
      anchor.target = "_blank";
      anchor.innerHTML =
        'Powered by <span style="letter-spacing: 0.25px;font-size: 14px; vertical-align: unset;">Coin<b style="vertical-align: unset;">Stats</b></span>';
      anchor.style.cssText =
        "\n      font-size: 12px;\n      font-weight: 300;\n      text-decoration: none;\n      color: " +
        textColor +
        ";\n      font-family: Roboto, Arial, Helvetica, sans-serif !important;\n      vertical-align: unset;    \n      ";
      credits.style.cssText =
        "\n      padding-top: 10px;\n      padding-left: 34px;\n      vertical-align: unset;\n    ";
      credits.appendChild(anchor);
      return credits;
    }
    function createStyle(colors) {
      var style = document.createElement("style");
      style.setAttribute("type", "text/css");
      var styleCss = document.createTextNode(
        "\n    coin-stats-chart-widget {\n      word-break: initial;\n      word-wrap: initial;\n      box-sizing: border-box;\n    }\n    .cs-chart-round-buttons-block {\n      display: flex;\n      justify-content: space-between;\n    }\n    .cs-chart-round-button:not(:first-child) {\n      margin-left: 10px;\n    }\n    \n    .cs-chart-round-button {\n      border-radius: 20px;\n      background-color: " +
          colors.buttons +
          ";\n      text-transform: uppercase;\n      text-align: center;\n      font-size: 15px;\n      opacity: 0.8;\n      font-weight: bold;\n      cursor: pointer;\n      color: " +
          colors.text +
          ";\n    }\n    .type-switcher {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    }\n    .cs-circular-loader-block .cs-circular-loader-svg {\n      animation: rotate 2s linear infinite;\n      height: 50px;\n      width: 50px;\n      transform-origin: center center;\n      margin: auto;\n    }\n    .cs-circular-loader-block .cs-circular-loader-circle {\n      stroke-dasharray: 89, 500;\n      stroke-dashoffset: 0;\n      stroke: " +
          colors.chartColor +
          ";\n      animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;\n      stroke-linecap: round;\n    }\n    .cs-circular-loader-block {\n      text-align: center;\n      display: block;\n      color: " +
          colors.chartColor +
          ";\n      width: 100%;\n      margin-top: 14px;\n      animation: color 6s ease-in-out infinite;\n      font-size: 16px;\n    }\n    @keyframes dash-result {\n      100% {\n        stroke-dasharray: 200, 500;\n        stroke-dashoffset: 0;\n      }\n    }\n    @keyframes rotate {\n      100% {\n        transform: rotate(360deg);\n      }\n    }\n    @keyframes dash {\n      0% {\n        stroke-dasharray: 1, 500;\n        stroke-dashoffset: 0;\n      }\n      50% {\n        stroke-dasharray: 89, 500;\n        stroke-dashoffset: -35;\n      }\n      100% {\n        stroke-dasharray: 89, 500;\n        stroke-dashoffset: -124;\n      }\n    }\n    @keyframes color {\n      100%,\n      0% {\n        stroke: " +
          colors.chartColor +
          ";\n      }\n      40% {\n        stroke: " +
          colors.chartColor +
          ";\n      }\n      66% {\n        stroke: " +
          colors.chartColor +
          ";\n      }\n      80%,\n      90% {\n        stroke: " +
          colors.chartColor +
          ";\n      }\n    }\n    .coin-chart-price {\n      font-size: 16px;\n      font-weight: 300;\n    }\n    .highcharts-tooltip text {\n      color: " +
          colors.text +
          " !important;\n      fill: " +
          colors.text +
          " !important;\n    }\n    .highcharts-tooltip .highcharts-label-box {\n      fill: " +
          colors.chartLabelBackground +
          ";\n      stroke: " +
          colors.chartLabelBackground +
          ";\n    }\n    .pure-material-checkbox span {\n      font-size: 16px;\n      font-weight: 300;\n      font-weight: normal;\n      font-style: normal;\n      font-stretch: normal;\n      line-height: normal;\n      color: " +
          colors.text +
          ";\n      opacity: 0.8;\n    }\n    \n    .pure-material-checkbox {\n      position: relative;\n      display: flex;\n      align-items: flex-end;\n    }\n\n    .pure-material-checkbox > input {\n      appearance: none;\n      -moz-appearance: none;\n      -webkit-appearance: none;\n      z-index: -1;\n      position: absolute;\n      left: -10px;\n      top: -8px;\n      display: block;\n      margin: 0;\n      border-radius: 50%;\n      width: 40px;\n      height: 40px;\n      box-shadow: none;\n      outline: none;\n      opacity: 0;\n      transform: scale(1);\n      pointer-events: none;\n      transition: opacity 0.3s, transform 0.2s;\n    }\n    \n    .pure-material-checkbox > span {\n      cursor: pointer;\n    }\n    \n    .pure-material-checkbox > span::before {\n      content: '';\n      display: inline-block;\n      box-sizing: border-box;\n      margin: 0 11px 3px 1px;\n      border: solid 2px; /* Safari */\n      border-radius: 2px;\n      width: 16px;\n      height: 16px;\n      vertical-align: top;\n      transition: border-color 0.2s, background-color 0.2s;\n    }\n    \n    .pure-material-checkbox > span::after {\n      content: \"\";\n      display: block;\n      position: absolute;\n      top: 1px;\n      left: 1px;\n      width: 8px;\n      height: 3px;\n      border: solid 2px transparent;\n      border-right: none;\n      border-top: none;\n      transform: translate(3px, 4px) rotate(-45deg);\n    }\n    \n    .pure-material-checkbox > input:indeterminate + span::after {\n      border-left: none;\n      transform: translate(4px, 3px);\n    }\n    \n    .pure-material-checkbox:hover > input {\n      opacity: 0.04;\n    }\n    \n    .pure-material-checkbox > input:focus {\n      opacity: 0.12;\n    }\n    \n    .pure-material-checkbox:hover > input:focus {\n      opacity: 0.16;\n    }\n    \n    .pure-material-checkbox > input:active {\n      opacity: 1;\n      transform: scale(0);\n      transition: transform 0s, opacity 0s;\n    }\n    \n    .pure-material-checkbox > input:checked:active + span::before {\n      border-color: transparent;\n    }\n    \n    /* Disabled */\n    .pure-material-checkbox > input:disabled {\n      opacity: 0;\n    }\n    \n    .pure-material-checkbox > input:disabled + span {\n      color: grey;\n      cursor: initial;\n    }\n    .chart-checkbox-usd > span::before {\n      border-color: " +
          colors.chartColor +
          ";\n    }\n    .chart-checkbox-usd > input:checked,\n    .chart-checkbox-usd > input:indeterminate {\n      background-color: " +
          colors.chartColor +
          ";\n    }\n    .chart-checkbox-usd > input:checked + span::after,\n    .chart-checkbox-usd > input:indeterminate + span::after {\n      border-color: " +
          colors.chartColor +
          ";\n    }\n    .chart-checkbox-usd > input:checked:active + span::before {\n      border-color: transparent;\n    }\n    .chart-checkbox-btc {\n      margin-left: 40px;\n    }\n    .chart-checkbox-btc > span::before {\n      border-color: " +
          colors.btc +
          ";\n    }\n    .chart-checkbox-btc > input:checked,\n    .chart-checkbox-btc > input:indeterminate {\n      background-color: " +
          colors.btc +
          ";\n    }\n    .chart-checkbox-btc > input:checked + span::after,\n    .chart-checkbox-btc > input:indeterminate + span::after {\n      border-color: " +
          colors.btc +
          ";\n    }\n    .chart-checkbox-btc > input:checked:active + span::before {\n      border-color: transparent;\n    }\n\n    .chart-checkbox-eth {\n      margin-left: 40px;\n    }\n    .chart-checkbox-eth > span::before {\n      border-color: " +
          colors.eth +
          ";\n    }\n    .chart-checkbox-eth > input:checked,\n    .chart-checkbox-eth > input:indeterminate {\n      background-color: " +
          colors.eth +
          ";\n    }\n    .chart-checkbox-eth > input:checked + span::after,\n    .chart-checkbox-eth > input:indeterminate + span::after {\n      border-color: " +
          colors.eth +
          ";\n    }\n    .chart-checkbox-eth > input:checked:active + span::before {\n      border-color: transparent;\n    }\n    .checkbox-container {\n      display: flex;\n      margin-top: 20px;\n    }\n    .checkbox-placeholder {\n      width: 202.067px;\n      height: 21px;\n    }\n    .cs-chart-selected-button {\n      color: " +
          colors.chartColor +
          ";\n    }\n    coin-stats-chart-widget *, coin-stats-chart-widget *:after, coin-stats-chart-widget *:before {\n      box-sizing: unset;\n    }\n  "
      );
      style.appendChild(styleCss);
      return style;
    }
    function createTypeSwitcher(buttonsBlock, container, height, coinId, localeAtt, chartId, type) {
      var typeSwitcherBlock = document.createElement("div");
      var candleChartIcon =
        '\n        <svg width="22px" height="17px" viewBox="0 0 22 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n            <g id="Buttons/candle-Copy-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n                <g id="Buttons/candle" transform="translate(4.000000, 2.000000)" fill="' +
        globalColors.chartColor +
        '">\n                    <path d="M3.04705882,9.75 L3.29411765,9.75 C3.74894038,9.75 4.11764706,9.38623136 4.11764706,8.9375 L4.11764706,3.25 C4.11764706,2.80126864 3.74894038,2.4375 3.29411765,2.4375 L3.04705882,2.4375 L2.55294118,2.4375 L2.47058824,2.4375 C2.0157655,2.4375 1.64705882,2.80126864 1.64705882,3.25 L1.64705882,8.9375 C1.64705882,9.38623136 2.0157655,9.75 2.47058824,9.75 L2.55294118,9.75 L3.04705882,9.75 Z M3.45882353,11.0438429 L3.45882353,12.5882353 C3.45882353,12.8156467 3.27447019,13 3.04705882,13 L2.55294118,13 C2.32552981,13 2.14117647,12.8156467 2.14117647,12.5882353 L2.14117647,11.0251543 C1.11502915,10.8688277 0.329411765,9.99368048 0.329411765,8.9375 L0.329411765,3.25 C0.329411765,2.19381952 1.11502915,1.31867234 2.14117647,1.16234566 L2.14117647,0.411764706 C2.14117647,0.184353338 2.32552981,4.17747905e-17 2.55294118,0 L3.04705882,5.55111512e-17 C3.27447019,1.37363607e-17 3.45882353,0.184353338 3.45882353,0.411764706 L3.45882353,1.14365707 C4.56440315,1.22663361 5.43529412,2.13797516 5.43529412,3.25 L5.43529412,8.9375 C5.43529412,10.0495248 4.56440315,10.9608664 3.45882353,11.0438429 Z M11.2823529,10.5625 L11.5294118,10.5625 C11.9842345,10.5625 12.3529412,10.1987314 12.3529412,9.75 L12.3529412,6.5 C12.3529412,6.05126864 11.9842345,5.6875 11.5294118,5.6875 L11.2823529,5.6875 L10.7882353,5.6875 L10.7058824,5.6875 C10.2510596,5.6875 9.88235294,6.05126864 9.88235294,6.5 L9.88235294,9.75 C9.88235294,10.1987314 10.2510596,10.5625 10.7058824,10.5625 L10.7882353,10.5625 L11.2823529,10.5625 Z M11.6941176,11.8563429 L11.6941176,12.5882353 C11.6941176,12.8156467 11.5097643,13 11.2823529,13 L10.7882353,13 C10.5608239,13 10.3764706,12.8156467 10.3764706,12.5882353 L10.3764706,11.8376543 C9.35032327,11.6813277 8.56470588,10.8061805 8.56470588,9.75 L8.56470588,6.5 C8.56470588,5.44381952 9.35032327,4.56867234 10.3764706,4.41234566 L10.3764706,0.411764706 C10.3764706,0.184353338 10.5608239,-6.9247512e-17 10.7882353,-1.11022302e-16 L11.2823529,0 C11.5097643,-4.17747905e-17 11.6941176,0.184353338 11.6941176,0.411764706 L11.6941176,4.39365707 C12.7996973,4.47663361 13.6705882,5.38797516 13.6705882,6.5 L13.6705882,9.75 C13.6705882,10.8620248 12.7996973,11.7733664 11.6941176,11.8563429 Z" id="Combined-Shape"></path>\n                </g>\n            </g>\n        </svg>\n      ';
      var lineChartIcon =
        '\n        <svg width="22px" height="17px" viewBox="0 0 22 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n            <g id="Buttons/candle-Copy-3" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n                <path d="M7.70050351,5.79604014 L4.16952066,11.2059216 C3.98478747,11.4889546 3.5946617,11.5754497 3.29815036,11.3991138 C3.00163903,11.2227779 2.91102494,10.8503859 3.09575814,10.5673529 L7.19650871,4.28452012 C7.45184643,3.89331267 8.05371248,3.90843945 8.28712934,4.31193084 L10.5930695,8.2980482 L13.1307307,8.2980482 C13.3401517,8.2980482 13.5359982,8.39698618 13.6537736,8.56227976 L15.4947497,11.1460233 L17.7861098,6.05576125 C17.924027,5.74937778 18.2960317,5.60772671 18.6170054,5.73937472 C18.9379792,5.87102274 19.0863759,6.22611742 18.9484586,6.53250089 L16.2016659,12.6345078 C16.0045045,13.0725022 15.3783139,13.1298911 15.0974485,12.7357067 L12.7959587,9.50564876 L10.2197774,9.50564876 C9.98947233,9.50564876 9.77736619,9.38616737 9.66603802,9.19372215 L7.70050351,5.79604014 Z" id="Stroke-1" fill="' +
        globalColors.chartColor +
        '"></path>\n            </g>\n        </svg>\n      ';
      typeSwitcherBlock.setAttribute("class", "cs-chart-round-button type-switcher");
      typeSwitcherBlock.innerHTML = isLineChart ? candleChartIcon : lineChartIcon;
      var handleClick = function handleClick() {
        isLineChart = !isLineChart;
        typeSwitcherBlock.innerHTML = isLineChart ? candleChartIcon : lineChartIcon;
        if (isLineChart) {
          createChart(container, height, localeAtt, chartId, type);
        } else {
          Array.from(container.children).forEach(function (el, i) {
            if (i) {
              el.firstChild.checked = false;
            } else {
              el.firstChild.checked = true;
            }
          });
          getCandleChartData(
            coinId,
            function () {
              createCandleChart(height, chartId);
            },
            globalTimeInterval
          );
        }
      };
      typeSwitcherBlock.addEventListener("click", handleClick);
      buttonsBlock.appendChild(typeSwitcherBlock);
    }
    function createButtonsSection(container, height, coinId, localeAtt, chartId, type) {
      var buttonsBlock = document.createElement("div");
      var timeIntervals = ["24h", "1w", "1m", "3m", "6m", "1y", "all"];
      buttonsBlock.style.cssText = "\n        margin-top: 10px;\n        width: 100%\n      ";
      createTypeSwitcher.apply(undefined, [buttonsBlock].concat(Array.prototype.slice.call(arguments)));
      timeIntervals.forEach(function (timeInterval) {
        var buttonBlock = document.createElement("div");
        if (timeInterval === "24h") {
          buttonBlock.setAttribute("class", "cs-chart-round-button cs-chart-selected-button");
        } else {
          buttonBlock.setAttribute("class", "cs-chart-round-button");
        }
        buttonBlock.addEventListener("click", function (event) {
          globalTimeInterval = timeInterval;
          if (isLineChart) {
            getData(
              coinId,
              function (data) {
                globalData = data;
                chartIntervalClick(event, timeInterval);
                createChart(container, height, localeAtt, chartId, type);
              },
              timeInterval
            );
          } else {
            var currency = getCheckedBoxName(container);
            var showCurrency = currency;
            if (currency === "USD" && globalCurrency !== "USD") {
              showCurrency = globalCurrency;
            }
            getCandleChartData(
              coinId,
              function () {
                chartIntervalClick(event, timeInterval);
                createCandleChart(height, chartId, showCurrency);
              },
              timeInterval,
              currency
            );
          }
        });
        buttonBlock.innerHTML = timeInterval;
        buttonsBlock.appendChild(buttonBlock);
      });
      buttonsBlock.setAttribute("class", "cs-chart-round-buttons-block");
      return buttonsBlock;
    }
    function chartIntervalClick(event) {
      var buttonsBlock = event.target.parentElement;
      for (var i = 0; i < buttonsBlock.children.length; i++) {
        var button = buttonsBlock.children[i];
        button.classList.remove("cs-chart-selected-button");
      }
      event.target.classList.add("cs-chart-selected-button");
    }
    function setLoader(container) {
      var svgBlock = document.createElement("div");
      var svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      var circleNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      svgBlock.setAttribute("class", "cs-circular-loader-block");
      svgNode.setAttribute("class", "cs-circular-loader-svg");
      svgNode.setAttribute("viewBox", "25 25 50 50");
      circleNode.setAttribute("class", "cs-circular-loader-circle");
      circleNode.setAttribute("cx", "50");
      circleNode.setAttribute("cy", "50");
      circleNode.setAttribute("r", "20");
      circleNode.setAttribute("fill", "none");
      circleNode.setAttribute("stroke-width", "2");
      circleNode.setAttribute("stroke-miterlimit", "10");
      circleNode.setAttribute("stroke-dasharray", "200, 200");
      circleNode.setAttribute("stroke-dashoffset", "0");
      svgNode.appendChild(circleNode);
      svgBlock.appendChild(svgNode);
      container.appendChild(svgBlock);
    }
    function removeLoader(container) {
      for (var i = 0; i < container.children.length; i++) {
        var el = container.children[i];
        if (el.classList.value === "cs-circular-loader-block") {
          container.removeChild(el);
        }
      }
    }
    function createCheckboxesSection(localeAtt, height, chartId, type) {
      var checkboxesBlock = document.createElement("div");
      var symbols = ["USD", "BTC", "ETH"];
      symbols.forEach(function (symbol, index) {
        var label = document.createElement("label");
        var input = document.createElement("input");
        var span = document.createElement("span");
        label.setAttribute(
          "class",
          "pure-material-checkbox" + " " + "chart-checkbox-" + symbol.toLowerCase()
        );
        input.setAttribute("type", "checkbox");
        input.setAttribute("class", "currency-checkbox");
        input.setAttribute("name", symbol);
        if (!index) {
          input.setAttribute("checked", "");
        }
        var showSymbol = symbol;
        if (globalCurrency !== "USD" && !index) {
          showSymbol = globalCurrency;
        }
        span.innerHTML = showSymbol;
        label.appendChild(input);
        label.appendChild(span);
        checkboxesBlock.appendChild(label);
        input.addEventListener("click", function (event) {
          handleCheckBoxChange(checkboxesBlock, height, localeAtt, chartId, type, event);
        });
      });
      checkboxesBlock.setAttribute("class", "checkbox-container");
      return checkboxesBlock;
    }
    function getCheckedBoxName(container) {
      var checkBoxes = container.children;
      var checkedUSD = checkBoxes[0].firstChild.checked && checkBoxes[0].firstChild.name;
      var checkedBTC = checkBoxes[1].firstChild.checked && "BTC";
      var checkedETH = checkBoxes[2].firstChild.checked && "ETH";
      return checkedUSD || checkedBTC || checkedETH;
    }
    function handleCheckBoxChange(container, height, localeAtt, chartId, type, event) {
      var checkedBoxes = Array.from(container.children).filter(function (element) {
        return element.firstChild.checked;
      });
      if (checkedBoxes.length === 0) {
        event.target.checked = true;
        event.stopPropagation();
      } else if (checkedBoxes.length === 1 || isLineChart) {
        createChart(container, height, localeAtt, chartId, type);
      } else {
        checkedBoxes.forEach(function (el) {
          if (el.firstChild.name !== event.target.name) {
            el.firstChild.checked = false;
          }
        });
        var showCurrency = event.target.name;
        if (showCurrency === "USD" && globalCurrency !== "USD") {
          showCurrency = globalCurrency;
        }
        getCandleChartData(
          globalCoinId,
          function () {
            createCandleChart(height, chartId, showCurrency);
          },
          globalTimeInterval,
          event.target.name
        );
      }
    }
    function createFirstRow(coinData, colors, type) {
      var firstRowContainer = document.createElement("div");
      var coinNameContainer = document.createElement("div");
      firstRowContainer.style.cssText =
        "\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      max-width: 90%;\n      margin: 30px auto 0;\n    ";
      coinNameContainer.style.cssText =
        "\n      display: flex;\n      align-items: center;\n      cursor: pointer;\n    ";
      var logoNode = createLogoNode(coinData.ic);
      var coinName = createTitle(coinData.n, coinData.s);
      coinNameContainer.addEventListener("click", function () {
        window.open("https://coinstats.app/en/coins/" + coinData.i);
      });
      coinNameContainer.appendChild(logoNode);
      coinNameContainer.appendChild(coinName);
      firstRowContainer.appendChild(coinNameContainer);
      if (type === "large") {
        firstRowContainer.appendChild(createPercentNode(colors));
      }
      return firstRowContainer;
    }
    function createChartContainer(id, colors) {
      var chartContainer = document.createElement("div");
      chartContainer.setAttribute("id", id);
      chartContainer.style.cssText =
        "\n        max-width: 90%;\n        padding: 20px 0;\n        border-bottom: solid 1px " +
        colors.border +
        ";\n        margin: 0 auto;\n      ";
      return chartContainer;
    }
    function createPercentNode(colors) {
      var percentBlock = document.createElement("div");
      var percnetNode = document.createElement("span");
      var status = diffPercent < 0 ? "statusDown" : "statusUp";
      var arrowSvg =
        "\n        <svg " +
        (status === "statusDown" ? 'style="transform: rotate(0.5turn);"' : "") +
        ' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\n          <path fill="' +
        colors[status] +
        '" fill-rule="evenodd" d="M8.894 5.789l2.382 4.764A1 1 0 0 1 10.382 12H5.618a1 1 0 0 1-.894-1.447l2.382-4.764a1 1 0 0 1 1.788 0z"/>\n        </svg>\n      ';
      percentBlock.style.cssText =
        "\n        font-size: 16px;\n        font-weight: 300;\n        color: " + colors.text + ";\n      ";
      percnetNode.style.cssText = "\n        display: flex;\n        align-items: center;\n      ";
      percentBlock.className = "cs-percent-block";
      percnetNode.innerHTML =
        '<span style="margin-right: 10px; opacity: 0.8;">' +
        globalTimeInterval.toUpperCase() +
        " Change</span>" +
        arrowSvg +
        ('<span style="color: ' +
          colors[status] +
          ';">' +
          (Math.abs(diffPercent).toFixed(2) + "%") +
          "</span>");
      percentBlock.appendChild(percnetNode);
      return percentBlock;
    }
    function updatePercentBlock() {
      var percentBlock = placeHolder.querySelector(".cs-percent-block");
      if (percentBlock) {
        var parent = percentBlock.parentElement;
        parent.removeChild(percentBlock);
        parent.appendChild(createPercentNode(globalColors));
      }
    }
    function createTitle(coinName, symbol) {
      var title = document.createElement("span");
      title.style.cssText =
        "\n      font-size: 15px;\n      font-weight: 300;\n      opacity: 0.8;\n      font-weight: normal;\n      font-style: normal;\n      font-stretch: normal;\n      line-height: normal;\n      letter-spacing: normal;\n      color: " +
        globalColors.text +
        ";\n      margin-left: 20px;\n    ";
      title.appendChild(document.createTextNode(coinName + " (" + symbol + ")"));
      return title;
    }
    function iconMaker(icon) {
      if (icon && icon.toLowerCase().indexOf("http") >= 0) {
        return icon;
      }
      return "https://api.coin-stats.com/api/files/812fde17aea65fbb9f1fd8a478547bde/" + icon;
    }
    function createLogoNode(src) {
      var logoNode = document.createElement("img");
      logoNode.setAttribute("src", iconMaker(src));
      logoNode.style.cssText = "\n    height: 40px;\n    width: 40px;\n  ";
      return logoNode;
    }
    function createCandleChart(height, chartId, currency) {
      function formatTooltip(tooltip) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.x;
        var points = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.points;
        var currencySymbol = void 0;
        if (currency) {
          currencySymbol = currencies[currency].symbol;
        } else {
          currencySymbol = currencies[globalCurrency].symbol;
        }
        var point = points[0].point;
        var result =
          "\n      <b>" +
          formateDate(x) +
          "</b>\n      <br/>Open: " +
          currencySymbol +
          formatePrice(point.open, globalCurrency) +
          "\n      <br/>High: " +
          currencySymbol +
          formatePrice(point.high, globalCurrency) +
          "<br/>Low: " +
          currencySymbol +
          formatePrice(point.low, globalCurrency) +
          "<br/>Close: " +
          currencySymbol +
          formatePrice(point.close, globalCurrency) +
          "<br/>";
        return result;
      }
      var config = {
        navigator: { enabled: false },
        scrollbar: { enabled: false },
        chart: { backgroundColor: globalColors.chartBg, height: height },
        rangeSelector: { enabled: false },
        plotOptions: { candlestick: { color: globalColors.statusDown, upColor: globalColors.statusUp } },
        credits: { enabled: false },
        tooltip: { formatter: formatTooltip, shared: true },
        xAxis: [
          {
            lineColor: globalColors.gridsColor,
            tickColor: globalColors.gridsColor,
            gridLineWidth: 1,
            gridLineColor: globalColors.gridsColor,
            crosshair: { color: globalColors.text },
            labels: {
              formatter: function formatter() {
                return formateDate(this.value, true);
              },
              style: { color: globalColors.text },
            },
          },
        ],
        yAxis: [
          {
            title: "",
            labels: {
              formatter: function formatter() {
                return (
                  "<span>\n              " +
                  formatePrice(this.value, globalCurrency) +
                  "\n                </span>"
                );
              },
              style: { color: globalColors.text },
              x: 0,
              y: 0,
            },
            gridLineColor: globalColors.gridsColor,
            min: candleChartMin,
            max: candleChartMax,
            startOnTick: false,
            crosshair: { color: globalColors.text },
            opposite: false,
          },
        ],
        series: [
          {
            name: "",
            type: "candlestick",
            data: candleChartData,
            upLineColor: globalColors.statusUp,
            lineColor: globalColors.statusDown,
          },
        ],
      };
      Highcharts.stockChart(chartId, config);
    }
    function formateDate(inputDate, withBreaks) {
      var timeInterval = globalTimeInterval;
      var date = new Date(inputDate);
      var hour = date.getHours();
      var minute = date.getMinutes();
      var time = (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute);
      var monthName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
      if (timeInterval !== "24h") {
        var day = date.getDate();
        var month = date.getMonth();
        var year = date.getFullYear();
        if (withBreaks) {
          time = day + " " + monthName[month] + "<br/>" + year;
        } else if (timeInterval !== "1w") {
          time = day + " " + monthName[month] + " " + year;
        } else {
          time = day + " " + monthName[month] + " " + year + " " + time;
        }
      }
      return time;
    }
    function formatePrice(price, symbol) {
      var locale = "en";
      var minimumFractionDigits = 2;
      if (price % 1 === 0) {
        minimumFractionDigits = 0;
      } else if (symbol === "BTC") {
        minimumFractionDigits = 8;
      } else if (symbol === "ETH" && price < 1 && price > -1) {
        minimumFractionDigits = 8;
      } else if (price < 1 && price > -1) {
        minimumFractionDigits = 6;
      } else {
        minimumFractionDigits = 2;
      }
      if (navigator) {
        locale = navigator.language;
      }
      var formattedPrice = new Intl.NumberFormat(locale, {
        minimumFractionDigits: minimumFractionDigits,
        maximumFractionDigits: minimumFractionDigits,
      }).format(price);
      return commarize(formattedPrice);
    }
    function createChart(container, height, locale, chartId, type) {
      var coinChartInfoDates = [];
      var coinChartInfoUSD = [];
      var coinChartInfoBTC = [];
      var coinChartInfoETH = [];
      var coinChartInfoETHConvert = [];
      var checkBoxes = container.children;
      globalData.forEach(function (value) {
        coinChartInfoDates.push(value[0] * 1e3);
        coinChartInfoUSD.push(value[1]);
        coinChartInfoBTC.push(value[2]);
        coinChartInfoETH.push(value[3]);
        coinChartInfoETHConvert.push(value[3] / 0.24986247573117534);
      });
      var currency = globalCurrency;
      var coinId = globalCoinId;
      var coinChartInfoMainPair = coinChartInfoUSD;
      var isUsdBtcEth = currency === "USD" || currency === "BTC" || currency === "ETH";
      if (!isUsdBtcEth) {
        coinChartInfoMainPair = coinChartInfoUSD.map(function (el) {
          return el * currencies[currency].rate;
        });
      }
      var dates = coinChartInfoDates;
      var chartBg = "rgba(255, 255, 255,0)";
      var chartTextColor = globalColors.text;
      var pointsColor = "#fea856";
      var areaColorFrom = globalColors.areaColorFrom;
      var areaColorTo = globalColors.areaColorTo;
      var config = {
        title: "",
        chart: { backgroundColor: chartBg, height: height },
        plotOptions: {
          series: { marker: { fillColor: "transparent" } },
          area: {
            fillColor: {
              linearGradient: { y0: 0, y1: 1, x0: 0, x1: 1 },
              stops: [
                [0, areaColorTo],
                [1, areaColorFrom],
              ],
            },
            threshold: null,
            color: pointsColor,
          },
        },
        xAxis: { visible: false, gridLineColor: "transparent" },
        yAxis: [],
        series: [],
        credits: { enabled: false },
        tooltip: {
          formatter: function formatter() {
            return this.points.reduce(function (s, point) {
              return (
                s +
                ' \n          <br/><span class="chart-tooltlip" style="font-size:14px; color:' +
                point.series.color +
                '">' +
                point.series.name +
                '\n           </span>:\n          <span style="font-size:14px;">' +
                formatePrice(point.y, "USD") +
                "</span>"
              );
            }, "<span>" + formateDate(dates[this.x]) + "</span>");
          },
          crosshairs: false,
          shared: true,
        },
      };
      var maxMainPair = coinChartInfoMainPair[0];
      var minMainPair = coinChartInfoMainPair[0];
      var maxBTC = coinChartInfoBTC[0];
      var minBTC = coinChartInfoBTC[0];
      var maxETH = coinChartInfoETH[0];
      var minETH = coinChartInfoETH[0];
      var checkedUSD = void 0,
        checkedBTC = void 0,
        checkedETH = void 0;
      if (type === "medium" && (currency === "BTC" || currency === "ETH")) {
        if (coinId === "bitcoin") {
          checkedUSD = currency === "BTC";
          checkedETH = currency === "ETH";
        } else if (coinId === "ethereum") {
          checkedUSD = currency === "ETH";
          checkedBTC = currency === "BTC";
        }
      } else {
        checkedUSD = checkBoxes[0].firstChild.checked;
        checkedBTC = checkBoxes[1].firstChild.checked;
        checkedETH = checkBoxes[2].firstChild.checked;
      }
      if (checkedBTC) {
        coinChartInfoBTC.map(function (value) {
          if (minBTC > value) {
            minBTC = value;
          }
          if (maxBTC < value) {
            maxBTC = value;
          }
          return "";
        });
        var opposite = true;
        var _type = void 0;
        if (!checkedUSD && checkedETH) {
          opposite = false;
        }
        if (!checkedUSD && !checkedETH) {
          opposite = false;
          _type = "area";
        }
        config.yAxis.push({
          gridLineColor: "transparent",
          title: "",
          max: maxBTC,
          min: minBTC,
          opposite: opposite,
          labels: {
            formatter: function formatter() {
              return (
                '<span class="coin-chart-price">\n        à¸¿' +
                formatePrice(this.value, "BTC", locale) +
                "\n          </span>"
              );
            },
            style: { color: chartTextColor, opacity: 0.8 },
          },
        });
        config.series.push({
          name: "BTC",
          type: _type,
          states: { hover: { lineWidth: 2 } },
          showInLegend: false,
          data: coinChartInfoBTC,
          color: globalColors.btc,
        });
      }
      if (checkedETH) {
        var yAxis = void 0;
        var _type2 = void 0;
        if (!checkedUSD && checkedBTC) {
          yAxis = 1;
        }
        if (checkedUSD && checkedBTC) {
          yAxis = 1;
        }
        var _opposite = true;
        if (!checkedUSD && !checkedBTC) {
          _opposite = false;
          _type2 = "area";
        }
        coinChartInfoETH.map(function (value) {
          if (minETH > value) {
            minETH = value;
          }
          if (maxETH < value) {
            maxETH = value;
          }
          return "";
        });
        config.yAxis.push({
          gridLineColor: "transparent",
          title: "",
          opposite: _opposite,
          labels: {
            formatter: function formatter() {
              return (
                '<span class="coin-chart-price">\n          Îž' +
                formatePrice(this.value, "ETH", locale) +
                "\n            </span>"
              );
            },
            style: { color: chartTextColor, opacity: 0.8 },
          },
        });
        config.series.push({
          name: "ETH",
          type: _type2,
          states: { hover: { lineWidth: 2 } },
          showInLegend: false,
          yAxis: yAxis,
          data: coinChartInfoETH,
          color: globalColors.eth,
        });
      }
      if (checkedUSD) {
        var _yAxis = void 0;
        var _type3 = void 0;
        if (config.yAxis.length > 0) {
          _yAxis = 1;
        }
        if (checkedBTC && checkedETH) {
          _yAxis = 2;
        }
        if (!checkedBTC && !checkedETH) {
          _type3 = "area";
        }
        coinChartInfoMainPair.map(function (value) {
          if (minMainPair > value) {
            minMainPair = value;
          }
          if (maxMainPair < value) {
            maxMainPair = value;
          }
          return "";
        });
        config.yAxis.push({
          gridLineColor: "transparent",
          title: "",
          max: maxMainPair,
          min: minMainPair,
          lineWidth: 0,
          labels: {
            formatter: function formatter() {
              return (
                '<span class="coin-chart-price">\n        ' +
                (isUsdBtcEth ? "$" : currencies[currency].name) +
                new Intl.NumberFormat().format(this.value) +
                "\n          </span> "
              );
            },
            style: { color: chartTextColor, opacity: 0.8 },
          },
        });
        config.series.push({
          name: isUsdBtcEth ? "USD" : currencies[currency].name,
          type: _type3,
          yAxis: _yAxis,
          showInLegend: false,
          states: { hover: { lineWidth: 2 } },
          data: coinChartInfoMainPair,
          color: globalColors.chartColor,
        });
      }
      Highcharts.chart(chartId, config);
    }
  }
  function getCurrencies(callback) {
    return fetch("https://api.coin-stats.com/v3/currencies")
      .then(function (resFiats) {
        return resFiats.json();
      })
      .then(function (resFiats) {
        callback(resFiats);
      });
  }
  function createChartScript(callback) {
    var chartUrl = "https://static.coinstats.app/widgets/chart.js";
    if (document.querySelector('script[src = "' + chartUrl + '"]')) {
      callback();
      return;
    }
    var script = document.createElement("script");
    script.src = chartUrl;
    if (document.getElementsByTagName("head").length) {
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    script.onload = function () {
      callback();
    };
  }
  function initAll() {
    var allPlaceHolders = document.querySelectorAll("coin-stats-chart-widget");
    allPlaceHolders.forEach(function (node) {
      createWidget(node);
    });
  }
  function observeMutations() {
    var nodes = document.querySelectorAll("coin-stats-chart-widget");
    var observer = new MutationObserver(callback);
    nodes.forEach(function (node) {
      var disable = node.getAttribute("disable-mutation-observer");
      if (!disable) {
        observer.observe(node, config);
      }
    });
    function callback(MutationRecord) {
      createWidget(MutationRecord[0].target);
    }
  }
  function ready(callbackFunc) {
    if (document.readyState !== "loading") {
      callbackFunc();
    } else if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", callbackFunc);
    } else {
      document.attachEvent("onreadystatechange", function () {
        if (document.readyState === "complete") {
          callbackFunc();
        }
      });
    }
  }
  ready(function () {
    getCurrencies(function (res) {
      currencies = res;
      createChartScript(initAll);
      observeMutations();
    });
  });
}
