package com.karpuz.karpuz.Extensions

import android.graphics.Color
import android.graphics.PorterDuff
import android.widget.EditText
import com.karpuz.karpuz.R

fun EditText.errorState() {
    background.mutate().setColorFilter(Color.RED, PorterDuff.Mode.SRC_OVER)
}

fun EditText.clearErrorState() {
    setBackgroundResource(R.drawable.abc_edit_text_material)
}