package com.karpuz.karpuz.Activity

import android.support.v4.app.Fragment
import android.arch.lifecycle.ViewModelProvider
import android.arch.lifecycle.ViewModelProviders
import android.content.Intent
import android.os.Bundle
import android.support.design.widget.NavigationView
import android.support.design.widget.Snackbar
import android.support.v4.app.FragmentTransaction
import android.support.v4.view.GravityCompat
import android.support.v7.app.ActionBarDrawerToggle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import com.karpuz.karpuz.Fragment.ProfileFragment
import com.karpuz.karpuz.Fragment.ProjectsFragment
import com.karpuz.karpuz.Network.Config
import com.karpuz.karpuz.R
import com.karpuz.karpuz.ViewModel.UserViewModel
import com.squareup.picasso.Picasso
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.activity_home.*
import kotlinx.android.synthetic.main.app_bar_home.*
import kotlinx.android.synthetic.main.nav_header_home.*
import kotlinx.android.synthetic.main.project_cell.view.*
import java.util.*
import kotlin.collections.HashMap

class HomeActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    companion object {
        private const val TAG = "HomeActivity"
    }

    private val disposeBag = CompositeDisposable()

    private lateinit var userViewModel: UserViewModel
    private val fragments = HashMap<Int, Fragment>()
    private val titles = HashMap<Int, String>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)
        setSupportActionBar(toolbar)

        fragments.put(R.id.nav_homepage, ProjectsFragment())
        titles.put(R.id.nav_homepage, "Homepage")

        fragments.put(R.id.nav_profile, ProfileFragment())
        titles.put(R.id.nav_profile, "Profile")

        selectItem(R.id.nav_homepage)
        nav_view.setCheckedItem(R.id.nav_homepage)

        userViewModel = ViewModelProviders.of(this).get(UserViewModel::class.java)
        userViewModel.setUser(null)
        userViewModel.refreshUser { user, error ->
            when {
                user != null -> {
                    textView_drawer_full_name.text = user.full_name
                    textView_drawer_email.text = user.email
                    if (user.profile_image != null) {
                        Picasso.get().load(Config.baseProfileImageUrl+user.profile_image).into(imageView_drawer_user_pic)
                    } else {
                        Picasso.get().load(R.drawable.profile_icon).into(imageView_drawer_user_pic)
                    }
                }
                error != null -> Log.e(TAG, "Error when refreshing user profile: $error")
                else -> Log.e(TAG, "Error when refreshing user profile")
            }
        }

        fab.setOnClickListener { _ ->
            val createProjectIntent = Intent(this, CreateProjectActivity::class.java)
            startActivity(createProjectIntent)
        }

        val toggle = ActionBarDrawerToggle(
            this, drawer_layout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close
        )
        drawer_layout.addDrawerListener(toggle)
        toggle.syncState()

        nav_view.setNavigationItemSelectedListener(this)
    }

    override fun onPause() {
        super.onPause()
        disposeBag.clear()
    }

    override fun onBackPressed() {
        if (drawer_layout.isDrawerOpen(GravityCompat.START)) {
            drawer_layout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.home, menu)
        return true
    }

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        return selectItem(item.itemId)
    }

    private fun selectItem(itemId: Int): Boolean {
        drawer_layout.closeDrawer(GravityCompat.START)

        val fragment = fragments[itemId]
        if (fragment != null) {
            if (fragment is ProfileFragment) {
                fragment.setUserId(null)
            }
            val fragmentTransaction = supportFragmentManager.beginTransaction()
            fragmentTransaction.replace(R.id.frame_container, fragment)
            fragmentTransaction.setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
            fragmentTransaction.commit()
        } else {
            return false
        }

        setActionBarTitle(titles[itemId])

        return true
    }

    private fun setActionBarTitle(title: String?) {
        supportActionBar?.title = title
    }
}
