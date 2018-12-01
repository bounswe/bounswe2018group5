package com.karpuz.karpuz.Fragment

import android.arch.lifecycle.ViewModelProviders
import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.support.v4.app.Fragment
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.karpuz.karpuz.Activity.HomeActivity
import com.karpuz.karpuz.Network.Config

import com.karpuz.karpuz.R
import com.karpuz.karpuz.ViewModel.UserViewModel
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.fragment_profile.view.*
import kotlinx.android.synthetic.main.nav_header_home.*

private const val USER_ID = "user_id"

class ProfileFragment : Fragment() {

    companion object {
        private const val TAG = "ProfileFragment"
    }

    private var userId: String? = null
    private lateinit var userViewModel: UserViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            userId = it.getString(USER_ID)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view =  inflater.inflate(R.layout.fragment_profile, container, false)

        userViewModel = ViewModelProviders.of(this).get(UserViewModel::class.java)
        userViewModel.setUser(userId)
        userViewModel.refreshUser { user, error ->
            when {
                user != null -> {
                    view.textView_user_type.text = when {
                        user.type == 0 -> "CLIENT"
                        else -> "FREELANCER"
                    }
                    view.textView_user_full_name.text = user.full_name
                    view.textView_user_email.text = user.email
                    if (user.profile_image != null) {
                        Picasso.get().load(Config.baseProfileImageUrl+user.profile_image).into(view.imageView_profile_image)
                    } else {
                        Picasso.get().load(R.drawable.profile_icon).into(view.imageView_profile_image)
                    }
                }
                error != null -> Log.e(TAG, "Error when refreshing user profile: $error")
                else -> Log.e(TAG, "Error when refreshing user profile")
            }
        }

        return view
    }
}
