package com.karpuz.karpuz.Activity

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import com.karpuz.karpuz.R
import com.crashlytics.android.Crashlytics
import io.fabric.sdk.android.Fabric
import com.crashlytics.android.answers.Answers





class WelcomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Fabric.with(this, Crashlytics())
        Fabric.with(this, Answers())
        setContentView(R.layout.activity_welcome)
    }

    fun loginClicked(button: View) {
        val loginIntent = Intent(this, LoginActivity::class.java)
        startActivity(loginIntent)
    }

    fun signupClicked(button: View) {
        val signupIntent = Intent(this, SignupActivity::class.java)
        startActivity(signupIntent)
    }
}
