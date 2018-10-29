package com.karpuz.karpuz.Activity

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.karpuz.karpuz.Extensions.*
import com.karpuz.karpuz.Network.KarpuzAPIModels
import com.karpuz.karpuz.Network.KarpuzAPIService
import com.karpuz.karpuz.R
import com.kizitonwose.android.disposebag.DisposeBag
import com.kizitonwose.android.disposebag.disposedBy
import kotlinx.android.synthetic.main.activity_login.*
import java.util.concurrent.TimeUnit

class LoginActivity : AppCompatActivity() {

    private val disposeBag = DisposeBag(this)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
    }

    fun signInClicked(button: View) {
        loading_anim.visibility = View.VISIBLE
        KarpuzAPIService.login(
            KarpuzAPIModels.LoginBody(
                editText_login_username.text.toString(),
                editText_login_password.text.toString()
            )
        ).delay(1, TimeUnit.SECONDS).subscribe(
            { result ->
                loading_anim.visibility = View.INVISIBLE
                if (result.response && result.api_token != null) {
                    loginSuccessful(result.api_token)
                } else {
                    longToast("Login error: ${result.error}")
                }
            },
            { error ->
                runOnUiThread {
                    loading_anim.visibility = View.INVISIBLE
                    longToast("Login error!")
                }
            }
        ).disposedBy(disposeBag)
    }

    fun forgotPasswordClicked(button: View) {
        longToast("Password reset email sent for ${editText_login_username.text}")
        //TODO("to be implemented")
    }

    private fun loginSuccessful(token: String) {
        //TODO("Create user profile, create network instance")
        val homeIntent = Intent(this, HomeActivity::class.java)
        homeIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
        startActivity(homeIntent)
    }
}
