package com.karpuz.karpuz.Activity

import android.app.DatePickerDialog
import android.content.Context
import android.graphics.PorterDuff
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import com.karpuz.karpuz.R
import android.support.v4.app.NavUtils
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.Toolbar
import com.karpuz.karpuz.Extensions.longToast
import com.karpuz.karpuz.Extensions.shortToast
import com.karpuz.karpuz.Network.KarpuzAPIService
import io.reactivex.disposables.CompositeDisposable
import kotlinx.android.synthetic.main.activity_create_project.*
import kotlinx.android.synthetic.main.activity_login.*
import kotlinx.android.synthetic.main.app_bar_home.*
import java.util.*
import java.text.SimpleDateFormat


class CreateProjectActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "CreateProjectActivity"
    }

    private val disposeBag = CompositeDisposable()

    val deadlineCalendar = Calendar.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_project)

        val datePickerDialog = DatePickerDialog(this,
            DatePickerDialog.OnDateSetListener { _, year, month, dayOfMonth ->
                deadlineCalendar.set(year, month, dayOfMonth)
                val sdf = SimpleDateFormat("E, dd/MM/yyyy", Locale.getDefault())

                editText_deadline.setText(sdf.format(deadlineCalendar.time))
            },
            deadlineCalendar.get(Calendar.YEAR),
            deadlineCalendar.get(Calendar.MONTH),
            deadlineCalendar.get(Calendar.DAY_OF_MONTH))
        datePickerDialog.datePicker.minDate = Calendar.getInstance().timeInMillis

        editText_deadline.setOnClickListener {
            hideSoftKeyboard()
            datePickerDialog.show()
        }
    }

    override fun onPause() {
        super.onPause()
        disposeBag.clear()
    }

    private fun hideSoftKeyboard() {
        val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager

        if (imm?.isAcceptingText && currentFocus != null) {
            imm?.hideSoftInputFromWindow(currentFocus.windowToken, 0)
        }
    }

    fun createProjectTapped(button: View) {
        if (editText_title.text.isEmpty()) {
            shortToast("Title can't be empty!")
            return
        }
        if (editText_description.text.isEmpty()) {
            shortToast("Description can't be empty!")
            return
        }
        if (editText_deadline.text.isEmpty()) {
            shortToast("Deadline can't be empty!")
            return
        }
        if (editText_budget.text.isEmpty()) {
            shortToast("Budget can't be empty!")
            return
        }
        val deadlineString = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(deadlineCalendar.time)
        val budget = java.lang.Double.parseDouble(editText_budget.text.toString())

        disposeBag.add(
            KarpuzAPIService.instance.createProject(editText_title.text.toString(),
                editText_description.text.toString(),
                budget,
                deadlineString)
                .subscribe(
                    { result ->
                        if (result.response && result.error == null) {
                            Log.v(TAG, "Successfully created project")
                            finish()
                        } else if (result.error != null){
                            Log.e(TAG, "Error when creating project: ${result.error}")
                            shortToast("An error occured. Please try again!")
                        }
                    },
                    { error ->
                        Log.e(TAG, "Error when creating project: $error")
                        shortToast("An error occured. Please try again!")
                    }
                )
        )
    }
}
