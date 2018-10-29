package com.karpuz.karpuz.Extensions

import android.content.Context
import android.widget.Toast

fun Context.shortToast(message: CharSequence) {
    Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
}

fun Context.longToast(message: CharSequence) {
    Toast.makeText(this, message, Toast.LENGTH_LONG).show()
}