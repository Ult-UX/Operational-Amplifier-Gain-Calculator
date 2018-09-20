/*!
 * Operational Amplifier Gain Calculator v1.0.1
 * Copyright 2018 UltAudio.net (http://ultaudio.net/)
 * Licensed under MIT (https://raw.githubusercontent.com/Ult-UX/Operational-Amplifier-Gain-Calculator/master/LICENSE)
 */
; (function($, window, document, undefined) {
  // 创建插件，调用方式为 $('#calculator').OpAmpGainCalculator();
  $.fn.OpAmpGainCalculator = function() {
    // 获取实例 ID
    var container_id = '#' + this.attr('id');
    var container = $(container_id);
    // 初始化插件
    initialize(container);
    // 当改变放大器类型时，电路图也改变
    var gainType = container.find('input:checkbox');
    gainType.change(function() {
      if (gainType.prop('checked')) {
        $('#circuit').attr('src', 'https://raw.githubusercontent.com/Ult-UX/Operational-Amplifier-Gain-Calculator/master/src/Inverting Operational Amplifier.JPG')
      } else {
        $('#circuit').attr('src', 'https://raw.githubusercontent.com/Ult-UX/Operational-Amplifier-Gain-Calculator/master/src/Non-inverting Operational Amplifier.JPG')
      }
    });
    // 当修改任意一个参数时都重新计算
    container.find('input[type="number"]').each(function() {
      $(this).change(function() {
        var parameters = new Array;
        container.find('input[type="number"]').each(function(index) {
          parameters[index] = $(this).val();
        });
        var valid = parameters.filter(function(parameter) {
          return parameter > 0;
        });
        if (valid.length == 2) {
          return getResult(container, parameters);
        }
      });
    });
  };

  // 获取计算结果
  function getResult(container, parameters) {
    var gainType = container.find('input:checkbox');
    $.each(parameters, function(key, value) {
      if (!value) {
        switch (key) {
        case 0:
          return getGain(container, parameters[1], parameters[2], gainType);
        case 1:
          return getRf(container, parameters[0], parameters[2], gainType);
          break;
        case 2:
          return getRg(container, parameters[0], parameters[1], gainType);
          break;
        default:
          return;
        }
      }
    });
  };

  // 计算增益
  function getGain(container, Rf, Rg, gainType) {
    var result = new Number;
    if (gainType.prop('checked')) {
      result = Rf / Rg;
    } else {
      result = Rf / Rg + 1;
    }
    container.find('input').eq(0).val(result);
    gainType.change(function() {
      getGain(container, Rf, Rg, gainType);
    });
  };

  // 计算 Rf
  function getRf(container, gain, Rg, gainType) {
    var result = new Number;
    if (gainType.prop('checked')) {
      result = gain * Rg;
    } else {
      if (gain <= 1) {
        return errors(container, '非反相放大器增益必需大于1');
      }
      result = (gain - 1) * Rg;
    }
    container.find('input').eq(1).val(result);
    gainType.change(function() {
      getRf(container, gain, Rg, gainType);
    });
  };

  // 计算 Rg
  function getRg(container, gain, Rf, gainType) {
    var result = new Number;
    if (gainType.prop('checked')) {
      result = Rf / gain;
    } else {
      if (gain <= 1) {
        return errors(container, '非反相放大器增益必需大于1');
      }
      result = Rf / (gain - 1);
    }
    container.find('input').eq(2).val(result);
    gainType.change(function() {
      getRg(container, gain, Rf, gainType);
    });
  };

  // 输出错误信息
  function errors(container, msg) {
    container.find('span[name="msg"]').text('错误：' + msg);
  }
  // 初始化插件，创建计算器表单
  function initialize(container) {
    var html_tmp = '\
		  <h2>\
    运算放大器增益计算器\
  </h2>\
  <hr/>\
  <div class="row">\
    <div class="col-md-6">\
      <p class="text-center">\
        <img src="https://raw.githubusercontent.com/Ult-UX/Operational-Amplifier-Gain-Calculator/master/src/Non-inverting Operational Amplifier.JPG"\
        id="circuit" />\
      </p>\
    </div>\
    <div class="col-md-6">\
      <div class="form-group">\
        <label>\
          Gain\
        </label>\
        <input type="number" class="form-control">\
      </div>\
      <div class="form-group">\
        <label>\
          Rf\
        </label>\
        <input type="number" class="form-control">\
      </div>\
      <div class="form-group">\
        <label>\
          Rg\
        </label>\
        <input type="number" class="form-control">\
      </div>\
      <div class="checkbox">\
        <label>\
          <input type="checkbox">\
          反相放大器\
        </label>\
      </div>\
      <button type="reset" class="btn btn-warning">\
        重置计算器\
      </button>\
      <span class="text-warning" name="msg">\
      </span>\
    </div>\
  </div>';
    return container.html(html_tmp);
  }
  // 闭包
})(jQuery, window, document);
