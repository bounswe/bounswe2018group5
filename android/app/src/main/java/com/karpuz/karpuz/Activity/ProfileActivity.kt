package com.karpuz.karpuz.Activity

import android.os.Bundle
import android.support.v4.app.FragmentTransaction
import android.support.v7.app.AppCompatActivity
import com.karpuz.karpuz.Fragment.ProfileFragment
import com.karpuz.karpuz.R
import com.karpuz.karpuz.ViewModel.UserViewModel

class ProfileActivity : AppCompatActivity() {

    private lateinit var userViewModel: UserViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        val userId = intent.extras.getString("USER_ID", null)

        val profileFragment = ProfileFragment()
        profileFragment.setUserId(userId)
        val fragmentTransaction = supportFragmentManager.beginTransaction()
        fragmentTransaction.replace(R.id.frame_container, profileFragment)
        fragmentTransaction.setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
        fragmentTransaction.commit()
    }
}
