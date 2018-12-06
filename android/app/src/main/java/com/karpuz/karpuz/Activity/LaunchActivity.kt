package com.karpuz.karpuz.Activity

import android.accounts.AccountAuthenticatorActivity
import android.accounts.AccountManager
import android.content.Intent
import android.os.Bundle
import android.util.Log
import com.karpuz.karpuz.Extensions.longToast
import com.karpuz.karpuz.Network.*
import com.karpuz.karpuz.R
import io.reactivex.disposables.CompositeDisposable
import java.util.concurrent.TimeUnit






class LaunchActivity : AccountAuthenticatorActivity() {

    companion object {
        private const val TAG = "LaunchActivity"
    }

    private val disposeBag = CompositeDisposable()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_launch)

        val accountManager = AccountManager.get(this)
        val accounts = accountManager.getAccountsByType(Config.accountType)
        if (accounts.isEmpty() || !(accounts.any { account -> account.type == Config.accountType })) {
            Log.v(TAG, "No account found")
            showWelcomeActivity()
        } else {
            val karpuzAccount = accounts.first { account -> account.type == Config.accountType }
            val username = karpuzAccount.name
            val password = accountManager.getPassword(karpuzAccount)
            Log.v(TAG, "Account found, $username $password")
            disposeBag.add(
                KarpuzAPIService.login(
                    KarpuzAPIModels.LoginBody(
                        username,
                        password
                    ))
                    .subscribe(
                        { result ->
                            if (result.response && result.api_token != null) {
                                loginSuccessful(result.api_token)
                            } else {
                                longToast("Login error: ${result.error}")
                            }
                        },
                        { error ->
                            Log.e(TAG, "Error: $error")
                            runOnUiThread {
                                longToast("Login error!")
                                showWelcomeActivity()
                            }
                        }
                    )
            )
        }
    }

    override fun onPause() {
        super.onPause()
        disposeBag.clear()
    }

    private fun loginSuccessful(token: String) {
        KarpuzAPIService.create(token)
        val homeIntent = Intent(this, HomeActivity::class.java)
        startActivity(homeIntent)
        finish()
    }

    private fun showWelcomeActivity() {
        val welcomeIntent = Intent(this, WelcomeActivity::class.java)
        startActivity(welcomeIntent)
        finish()
    }
}
