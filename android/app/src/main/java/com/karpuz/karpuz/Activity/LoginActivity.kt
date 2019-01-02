package com.karpuz.karpuz.Activity

import android.accounts.Account
import android.accounts.AccountAuthenticatorActivity
import android.accounts.AccountManager
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import com.karpuz.karpuz.Extensions.*
import com.karpuz.karpuz.Network.Config
import com.karpuz.karpuz.Network.KarpuzAPIModels
import com.karpuz.karpuz.Network.KarpuzAPIProvider
import com.karpuz.karpuz.Network.KarpuzAPIService
import com.karpuz.karpuz.R
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.activity_login.*
import java.util.concurrent.TimeUnit

class LoginActivity : AccountAuthenticatorActivity() {

    companion object {
        private const val TAG = "LoginActivity"
    }

    private val disposeBag = CompositeDisposable()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
    }

    override fun onPause() {
        super.onPause()
        disposeBag.clear()
    }

    fun signInClicked(button: View) {
        loading_anim.visibility = View.VISIBLE
        val username = editText_login_username.text.toString()
        val password = editText_login_password.text.toString()
        disposeBag.add(
            KarpuzAPIService.login(
                KarpuzAPIModels.LoginBody(
                    username,
                    password
                ))
                .subscribe(
                { result ->
                    loading_anim.visibility = View.INVISIBLE
                    if (result.response && result.api_token != null) {
                        loginSuccessful(username, password, result.api_token)
                    } else {
                        longToast("Login error: ${result.error}")
                    }
                },
                { error ->
                    Log.e(TAG, "Error: $error")
                    runOnUiThread {
                        loading_anim.visibility = View.INVISIBLE
                        longToast("Login error!")
                    }
                }
            )
        )
    }

    fun forgotPasswordClicked(button: View) {
        longToast("Password reset email sent for ${editText_login_username.text}")
        //TODO("to be implemented")
    }

    private fun loginSuccessful(username: String, password: String, token: String) {
        val accounts = AccountManager.get(this).getAccountsByType(Config.accountType)
        if (accounts.isEmpty()) {
            val account = Account(username, Config.accountType)
            AccountManager.get(this).addAccountExplicitly(account, password, null)
        }
        KarpuzAPIService.create(token)
        val homeIntent = Intent(this, HomeActivity::class.java)
        homeIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        startActivity(homeIntent)
    }
}
