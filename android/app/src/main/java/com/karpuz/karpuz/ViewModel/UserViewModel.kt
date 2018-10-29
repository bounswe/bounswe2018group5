package com.karpuz.karpuz.ViewModel

import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import com.karpuz.karpuz.Network.KarpuzAPIModels
import com.karpuz.karpuz.Network.KarpuzAPIService
import io.reactivex.disposables.CompositeDisposable
import kotlin.Error

class UserViewModel: ViewModel() {

    private val disposeBag = CompositeDisposable()

    val user = MutableLiveData<KarpuzAPIModels.User?>()

    fun refreshUser(onUserReadyCallback: ((KarpuzAPIModels.User?, Error?) -> Unit)) {
        disposeBag.add(
            KarpuzAPIService.instance.getUserProfile(null)
                .subscribe(
                    { result ->
                        if (result.response && result.user != null) {
                            user.value = result.user
                            onUserReadyCallback(result.user, null)
                        } else {
                            onUserReadyCallback(null, Error("Invalid server response!"))
                        }
                    },
                    { error ->
                        onUserReadyCallback(null, Error("Error: $error"))
                    }
                )
        )
    }

    override fun onCleared() {
        super.onCleared()
        disposeBag.clear()
    }
}