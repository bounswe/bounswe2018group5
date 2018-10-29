package com.karpuz.karpuz.Helper

import android.accounts.AbstractAccountAuthenticator
import android.accounts.Account
import android.accounts.AccountAuthenticatorResponse
import android.accounts.NetworkErrorException
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.IBinder
import android.util.Log

class KarpuzAccountService : Service() {

    companion object {
        private val TAG = "KarpuzAccountService"
    }

    private var mAuthenticator: Authenticator? = null

    override fun onCreate() {
        Log.i(TAG, "Service created")
        mAuthenticator = Authenticator(this)
    }

    override fun onDestroy() {
        Log.i(TAG, "Service destroyed")
    }

    override fun onBind(intent: Intent): IBinder? {
        return mAuthenticator!!.iBinder
    }

    inner class Authenticator(context: Context) : AbstractAccountAuthenticator(context) {

        override fun editProperties(
            accountAuthenticatorResponse: AccountAuthenticatorResponse,
            s: String
        ): Bundle {
            throw UnsupportedOperationException()
        }

        @Throws(NetworkErrorException::class)
        override fun addAccount(
            accountAuthenticatorResponse: AccountAuthenticatorResponse,
            s: String, s2: String, strings: Array<String>, bundle: Bundle
        ): Bundle? {
            return null
        }

        @Throws(NetworkErrorException::class)
        override fun confirmCredentials(
            accountAuthenticatorResponse: AccountAuthenticatorResponse,
            account: Account, bundle: Bundle
        ): Bundle? {
            return null
        }

        @Throws(NetworkErrorException::class)
        override fun getAuthToken(
            accountAuthenticatorResponse: AccountAuthenticatorResponse,
            account: Account, s: String, bundle: Bundle
        ): Bundle {
            throw UnsupportedOperationException()
        }

        override fun getAuthTokenLabel(s: String): String {
            throw UnsupportedOperationException()
        }

        @Throws(NetworkErrorException::class)
        override fun updateCredentials(
            accountAuthenticatorResponse: AccountAuthenticatorResponse,
            account: Account, s: String, bundle: Bundle
        ): Bundle {
            throw UnsupportedOperationException()
        }

        @Throws(NetworkErrorException::class)
        override fun hasFeatures(
            accountAuthenticatorResponse: AccountAuthenticatorResponse,
            account: Account, strings: Array<String>
        ): Bundle {
            throw UnsupportedOperationException()
        }
    }
}