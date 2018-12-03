package com.karpuz.karpuz.ViewModel

import android.arch.lifecycle.MutableLiveData
import android.arch.lifecycle.ViewModel
import com.karpuz.karpuz.Network.KarpuzAPIModels
import com.karpuz.karpuz.Network.KarpuzAPIService
import io.reactivex.disposables.CompositeDisposable

class ProjectViewModel : ViewModel() {
    private val disposeBag = CompositeDisposable()

    //val projects = MutableLiveData<List<KarpuzAPIModels.Project>?>()

    override fun onCleared() {
        super.onCleared()
        disposeBag.clear()
    }

    fun getProjects(projectIds: List<String>, onProjectReadyCallback: (List<KarpuzAPIModels.Project>?, Error?) -> Unit) {
        disposeBag.add(
            KarpuzAPIService.instance.getProjects(projectIds)
                .subscribe(
                    { result ->
                        if (result.response && result.projects != null) {
                            onProjectReadyCallback(result.projects, null)
                        } else {
                            onProjectReadyCallback(null, Error("Invalid server response!"))
                        }
                    },
                    { error ->
                        onProjectReadyCallback(null, Error("Error: $error"))
                    }
                )
        )
    }
}