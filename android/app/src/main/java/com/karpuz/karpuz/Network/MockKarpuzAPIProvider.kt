package com.karpuz.karpuz.Network

import io.reactivex.Observable
import java.util.concurrent.TimeUnit

class MockKarpuzAPIProvider : KarpuzAPI {

    companion object {
        val instance = MockKarpuzAPIProvider()
    }

    private val testToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDA4MTQyMTMsInJvbGUiOm51bGwsImlkIjoiNWJkNmQ1ZTkzZTRkZDIwMDBiODIxZTI0In0.WBUjmBNONbA0jw4-MwYXYKdqAjLCrmAgyDolzyhn-bM"

    private constructor()

    override fun register(register: KarpuzAPIModels.RegisterBody): Observable<KarpuzAPIModels.RegisterResponse> {
        return Observable.just(KarpuzAPIModels.RegisterResponse(true, testToken)).delay(300, TimeUnit.MILLISECONDS)
    }

    override fun login(user: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse> {
        return Observable.just(KarpuzAPIModels.LoginResponse(true, testToken, null)).delay(300, TimeUnit.MILLISECONDS)
    }

    override fun getAllProjects(auth: String): Observable<KarpuzAPIModels.ProjectsResponse> {
        return Observable.just(KarpuzAPIModels.ProjectsResponse(true,
            KarpuzAPIModels.Projects(
                arrayOf(KarpuzAPIModels.Project(
                    "1",
                    "Project 1",
                    "2018-10-28T23:12:51.688",
                    "2018-10-28T23:12:51.688",
                    "1",
                    "First project",
                    "2018-10-28T23:12:51.688",
                    10.0,
                    0))
                )
            )
        ).delay(300, TimeUnit.MILLISECONDS)
    }

    override fun getUserProfile(auth: String): Observable<KarpuzAPIModels.UserResponse> {
        return Observable.just(KarpuzAPIModels.UserResponse(true,
            KarpuzAPIModels.User("MeteHan",
                null,
                "2018-10-29T09:42:01.151",
                "2018-10-29T09:42:01.151",
                null,
                "mete_han@metehan.com",
                "Mete Han",
                null,
                null))).delay(300, TimeUnit.MILLISECONDS)
    }

    override fun getUserProfile(auth: String, userId: String): Observable<KarpuzAPIModels.UserResponse> {
        return Observable.just(KarpuzAPIModels.UserResponse(true,
            KarpuzAPIModels.User("EnisSimsar",
                null,
                "2018-10-29T09:42:01.151",
                "2018-10-29T09:42:01.151",
                null,
                "enisimsar@metehan.com",
                "Enis Simsar",
                null,
                null))).delay(300, TimeUnit.MILLISECONDS)
    }
}