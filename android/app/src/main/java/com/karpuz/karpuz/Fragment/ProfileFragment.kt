package com.karpuz.karpuz.Fragment

import android.accounts.Account
import android.accounts.AccountManager
import android.arch.lifecycle.ViewModelProviders
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.support.v4.app.Fragment
import android.util.Log
import android.view.*
import com.karpuz.karpuz.Activity.HomeActivity
import com.karpuz.karpuz.Activity.WelcomeActivity
import com.karpuz.karpuz.Extensions.shortToast
import com.karpuz.karpuz.Network.Config

import com.karpuz.karpuz.R
import com.karpuz.karpuz.ViewModel.UserViewModel
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.fragment_profile.view.*
import kotlinx.android.synthetic.main.nav_header_home.*

class ProfileFragment : Fragment() {

    companion object {
        private const val TAG = "ProfileFragment"
    }

    private var userId: String? = null
    private lateinit var userViewModel: UserViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view =  inflater.inflate(R.layout.fragment_profile, container, false)

        setHasOptionsMenu(true)

        userViewModel = ViewModelProviders.of(this).get(UserViewModel::class.java)
        userViewModel.setUser(userId)
        refreshUser(view)

        return view
    }

    override fun onCreateOptionsMenu(menu: Menu?, inflater: MenuInflater?) {
        inflater?.inflate(R.menu.profile, menu)
        super.onCreateOptionsMenu(menu, inflater)
    }

    override fun onOptionsItemSelected(item: MenuItem?): Boolean {
        when {
            item?.itemId == R.id.profile_logout -> logout()
        }
        return super.onOptionsItemSelected(item)
    }

    fun setUserId(userId: String?) {
        this.userId = userId
        if (view != null) {
            refreshUser(view!!)
        }
    }

    private fun logout() {
        Log.v(TAG, "Logging out...")

        val accountManager = AccountManager.get(this.context)
        val accounts = accountManager.getAccountsByType(Config.accountType)
        if (accounts.first() != null) {
            accountManager.removeAccountExplicitly(accounts.first())
        }

        val welcomeIntent = Intent(this.context, WelcomeActivity::class.java)
        startActivity(welcomeIntent)
        this.activity?.finish()
    }

    private fun refreshUser(view: View) {
        Log.v(TAG, "Refreshing user...")
        userViewModel.refreshUser { user, error ->
            when {
                user != null -> {
                    view.textView_user_type.text = when {
                        user.type == 0 -> "FREELANCER"
                        user.type == -1 -> "CLIENT"
                        else -> "USER TYPE NOT SET"
                    }
                    view.textView_user_full_name.text = user.full_name
                    view.textView_user_email.text = user.email
                    if (user.profile_image != null) {
                        Picasso.get().load(Config.baseProfileImageUrl+user.profile_image).into(view.imageView_profile_image)
                    } else {
                        Picasso.get().load(R.drawable.profile_icon).into(view.imageView_profile_image)
                    }
                }
                error != null -> {
                    Log.e(TAG, "Error when refreshing user profile: $error")
                    activity?.shortToast("Error when getting user profile")
                }
                else -> {
                    Log.e(TAG, "Error when refreshing user profile")
                    activity?.shortToast("Error when getting user profile")
                }
            }
        }
    }
}
