package com.karpuz.karpuz.Activity

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.karpuz.karpuz.Extensions.errorState
import com.karpuz.karpuz.R
import com.karpuz.karpuz.Extensions.isValidEmail
import com.karpuz.karpuz.Extensions.clearErrorState
import com.karpuz.karpuz.Extensions.shortToast
import kotlinx.android.synthetic.main.activity_signup.*


class SignupActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)
    }

    fun registerClicked(button: View) {
        val emailAddress = editText_signup_email.text
        if (!emailAddress.isValidEmail()) {
            editText_signup_email.errorState()
            shortToast("Email is not valid!")
            return
        }
        editText_signup_email.clearErrorState()
        val password = editText_signup_password.text
        if (password.length < 8) {
            editText_signup_password.errorState()
            shortToast("Passwords should be at least 8 characters!")
            return
        }
        editText_signup_password.clearErrorState()
        val passwordRepeat = editText_signup_repeat_password.text
        if (password.toString() != passwordRepeat.toString()) {
            editText_signup_repeat_password.errorState()
            shortToast("Passwords do not match!")
            return
        }
        editText_signup_repeat_password.clearErrorState()
        // TODO register
    }
}
