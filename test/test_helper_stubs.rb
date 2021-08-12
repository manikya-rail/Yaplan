module TestHelpers
  module Stubbing
    def sign_in(user)
      stub_method_instance(ApplicationController, :authenticate_user!) { true }
      stub_method_instance(ApplicationController, :current_user) { user }
    end

    def reset_sign_in
      reset_stub_method_instance(ApplicationController, :authenticate_user!)
      reset_stub_method_instance(ApplicationController, :current_user)
    end

    # Stubbing a method on all instances of a class
    # and resetting afterwards
    def stub_method_instance(klass, method, &_block)
      new_method = :"new_#{method}"
      klass.class_eval do
        send(:alias_method, new_method, method)
        send(:define_method, method, ->(*args) { yield(args) })
      end
    end

    # and resetting afterwards
    def reset_stub_method_instance(klass, method)
      new_method = :"new_#{method}"
      klass.class_eval do
        undef_method method
        alias_method method, new_method
        undef_method new_method
      end
    end

    # Copied from http://blog.crowdint.com/2013/07/31/stubbing-any-instance-with-minitest.html
    # I believe this stubs a class method, currently unused.
    def stub_class_instance(klass, method, &_block)
      new_method = :"new_#{method}"

      klass.class_eval do
        def self.metaclass
          class << self; self; end
        end
      end

      klass.metaclass.send(:alias_method, new_method, method)
      klass.metaclass.send(:define_method, method, ->(*args) { yield(args) })

    ensure
      klass.metaclass.class_eval do
        undef_method method
        alias_method method, new_method
        undef_method new_method
      end
    end
  end
end
