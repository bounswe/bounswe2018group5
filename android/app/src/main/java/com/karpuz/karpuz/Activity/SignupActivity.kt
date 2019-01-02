package com.karpuz.karpuz.Activity

import android.accounts.Account
import android.accounts.AccountManager
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import com.karpuz.karpuz.Extensions.*
import com.karpuz.karpuz.Network.Config
import com.karpuz.karpuz.R
import com.karpuz.karpuz.Network.KarpuzAPIModels
import com.karpuz.karpuz.Network.KarpuzAPIProvider
import com.karpuz.karpuz.Network.KarpuzAPIService
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.activity_signup.*
import java.util.concurrent.TimeUnit

class SignupActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "SignupActivity"
    }

    private val disposeBag = CompositeDisposable()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_signup)
    }

    override fun onPause() {
        super.onPause()
        disposeBag.clear()
    }

    fun registerClicked(button: View) {
        val emailAddress = editText_signup_email.text.toString()
        if (!emailAddress.isValidEmail()) {
            editText_signup_email.errorState()
            shortToast("Email is not valid!")
            return
        }
        editText_signup_email.clearErrorState()
        val password = editText_signup_password.text.toString()
        if (password.length < 8) {
            editText_signup_password.errorState()
            shortToast("Passwords should be at least 8 characters!")
            return
        }
        editText_signup_password.clearErrorState()
        val passwordRepeat = editText_signup_repeat_password.text.toString()
        if (password != passwordRepeat) {
            editText_signup_repeat_password.errorState()
            shortToast("Passwords do not match!")
            return
        }
        editText_signup_repeat_password.clearErrorState()
        if (editText_signup_name.text.isEmpty()) {
            editText_signup_name.errorState()
            shortToast("Name is required for signup!")
            return
        }
        editText_signup_name.clearErrorState()
        if (editText_signup_username.text.isEmpty()) {
            editText_signup_username.errorState()
            shortToast("Username is required for signup!")
            return
        }
        editText_signup_username.clearErrorState()

        registerUser(KarpuzAPIModels.RegisterBody(
            editText_signup_username.text.toString(),
            password,
            editText_signup_name.text.toString(),
            emailAddress))
    }

    private fun registerUser(registerBody: KarpuzAPIModels.RegisterBody) {
        loading_anim.visibility = View.VISIBLE
        button_signup_register.isEnabled = false
        disposeBag.add(
            KarpuzAPIService.register(registerBody)
                .subscribe(
                { result ->
                    loading_anim.visibility = View.INVISIBLE
                    if (result.response && result.api_token != null) {
                        registerSuccessful(registerBody.username, registerBody.password, result.api_token)
                    } else {
                        longToast("Signup error!")
                    }
                },
                { error ->
                    Log.e(TAG, "Error: $error")
                    runOnUiThread {
                        loading_anim.visibility = View.INVISIBLE
                        button_signup_register.isEnabled = true
                        longToast("An error occurred while registering. Please try again!")
                    }
                }
            )
        )
    }

    private fun registerSuccessful(username: String, password: String, token: String) {
        val account = Account(username, Config.accountType)
        AccountManager.get(this).addAccountExplicitly(account, password, null)
        KarpuzAPIService.create(token)
        val homeIntent = Intent(this, HomeActivity::class.java)
        homeIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        startActivity(homeIntent)
    }
}
