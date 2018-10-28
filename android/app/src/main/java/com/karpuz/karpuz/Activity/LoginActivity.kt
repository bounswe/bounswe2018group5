package com.karpuz.karpuz.Activity

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.karpuz.karpuz.Extensions.*
import com.karpuz.karpuz.R
import kotlinx.android.synthetic.main.activity_login.*

class LoginActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
    }

    fun signInClicked(button: View) {
        val email = editText_login_email.text
        if (!email.isValidEmail()) {
            editText_login_email.errorState()
            shortToast("Email address is not valid!")
            return
        }
        editText_login_email.clearErrorState()
        //TODO login
    }

    fun forgotPasswordClicked(button: View) {
        val email = editText_login_email.text
        if (!email.isValidEmail()) {
            editText_login_email.errorState()
            shortToast("Email address is not valid!")
        }
        editText_login_email.clearErrorState()
        longToast("Password reset email sent to $email")
        //TODO send reset password email
    }
}
