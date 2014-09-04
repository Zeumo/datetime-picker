(function () {
  var DateTimePicker, pluginName = 'datetimepicker';

  DateTimePicker = function(el, options) {
    this.$el   = $(el);
    this.$body = $('body');

    this.options = _.extend({
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm A',
      template: _.template($('#tmpl-picker').html())
    }, options);

    this.setDateTime(this.dateTime());
    this.$picker = this.render();
    this.events();
  };

  DateTimePicker.prototype = {
    events: function() {
      var self = this;

      this.$el.on('focus', function(e) {
        self.closeAll();
        self.show();
      });

      $(document).on('click', function(e) {
        if (e.target.tagName === 'INPUT') return;
        if (e.target.tagName === 'TD') return;

        if (!$(e.target).closest('#datetime-picker').length) {
          self.close();
        }
      });
    },

    dateTime: function(offsetHours) {
      offsetHours = offsetHours || 1;

      if (this.hasPrecedingPicker()) {
        offsetHours += 1;
      }

      return {
        date: moment().format(this.options.dateFormat),
        time: moment().add(offsetHours, 'hour').startOf('hour')
                .format(this.options.timeFormat)
      };
    },

    setDateTime: function(obj) {
      var date = obj.date,
          time = obj.time,
          val, m;

      // Normalize minutes
      if (!(/\d:\d{2}/).test(time)) {
        time = time.replace(/(^\d+)/, "$1:00");
      }

      // Normalize spacing
      if (!(/\s[am|pm]/i).test(time)) {
        time = time.replace(/(am|pm)/i, " $1");
      }

      m = moment(date + ' ' + time);

      if (!m.isValid()) {
        var datetime = this.dateTime();
        m   = moment(datetime.date + ' ' + datetime.time);
      }

      val = m.format(this.options.dateFormat + ' ' + this.options.timeFormat);

      this.$el.val(val);

      if (this.$picker) {
        this.$picker.find('[name=date]').val(m.format(this.options.dateFormat));
        this.$picker.find('[name=time]').val(m.format(this.options.timeFormat));
      }
    },

    render: function() {
      var $picker = $(this.options.template(this.dateTime()));

      var $date = $picker.find('[name=date]');
      var $time = $picker.find('[name=time]');

      var $calendar = $picker.find('.calendar').datepicker({
        startDate: '-0d'
      });
      $calendar.datepicker('update', $date.val());

      $calendar.on('changeDate', _.bind(function(e) {
        var date = e.format();
        if (date) {
          $date.val(date);
          this.setDateTime({
            date: date,
            time: $time.val()
          });
        }
      }, this));

      $date.on('change', function(e) {
        $calendar.datepicker('update', e.currentTarget.value);
      });

      $time.on('change', _.bind(function(e) {
        this.setDateTime({
          date: $date.val(),
          time: e.currentTarget.value.toUpperCase()
        });
      }, this));

      $picker.on('click', '.done', _.bind(function(e) {
        e.preventDefault();
        this.close();
      }, this));

      return $picker;
    },

    show: function() {
      var elBottom = this.$el.height() + this.$el.offset().top;
      var elLeft    = this.$el.offset().left;

      this.$picker.css({
        top: elBottom + 10 + 'px',
        left: elLeft + 'px',
        position: 'absolute'
      });

      this.$body.append(this.$picker);
    },

    closeAll: function() {
      $('#datetime-picker').detach();
    },

    close: function() {
      this.$picker.detach();
    },

    hasPrecedingPicker: function() {
      var dtp = this.$el.siblings('input').data(pluginName);
      if (dtp) return true;
    }

  };

  $.fn[pluginName] = function (options) {
    this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new DateTimePicker(this, options));
      }
    });
    return this;
  };

  window.DateTimePicker = DateTimePicker;
})();
