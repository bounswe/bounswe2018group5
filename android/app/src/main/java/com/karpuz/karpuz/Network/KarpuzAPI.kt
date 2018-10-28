package com.karpuz.karpuz.Network

import io.reactivex.Observable
import retrofit2.http.*

interface KarpuzAPI {

    @POST
    fun register(@Body register: KarpuzAPIModels.RegisterBody): Observable<Void>

    @POST
    fun login(@Body user: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse>
}