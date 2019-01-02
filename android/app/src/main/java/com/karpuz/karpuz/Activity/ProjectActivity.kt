package com.karpuz.karpuz.Activity

import android.arch.lifecycle.ViewModelProviders
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.karpuz.karpuz.Extensions.shortToast
import com.karpuz.karpuz.Network.Config
import com.karpuz.karpuz.R
import com.karpuz.karpuz.ViewModel.ProjectViewModel
import com.karpuz.karpuz.ViewModel.UserViewModel
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.activity_project.*

class ProjectActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "ProjectActivity"
    }

    private lateinit var projectViewModel: ProjectViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_project)

        projectViewModel = ViewModelProviders.of(this).get(ProjectViewModel::class.java)

        val projectId = intent.extras.getString("PROJECT_ID", null)
        if (projectId != null) {
            setInfoFor(projectId)
        } else {
            shortToast("Error occurred!")
            finish()
        }
    }

    private fun setInfoFor(projectId: String) {
        projectViewModel.getProjects(arrayListOf(projectId)) { projects, error ->
            if (error != null) {
                Log.e(TAG, "Error when getting project: $error")
                shortToast("Error when getting project!")
            } else if (projects != null && projects.first() != null) {
                val project = projects.first()
                textView_project_title.text = project.title
                textView_project_description.text = project.description
                project_budget.text = project.budget.toString()+"$"
                project_deadline.text = project.deadline.subSequence(0, project.deadline.indexOf("T"))
                val user = project.owner
                textView_user_type.text = when {
                    user.type == 0 -> "FREELANCER"
                    user.type == -1 -> "CLIENT"
                    else -> "USER TYPE NOT SET"
                }
                textView_user_full_name.text = user.full_name
                textView_user_email.text = user.email
                if (user.profile_image != null) {
                    Picasso.get().load(Config.baseProfileImageUrl+user.profile_image).into(imageView_profile_image)
                } else {
                    Picasso.get().load(R.drawable.profile_icon).into(imageView_profile_image)
                }
            } else {
                Log.e(TAG, "Empty server response for projectIds $projectId")
                shortToast("Error when getting project!")
            }
        }
    }
}
