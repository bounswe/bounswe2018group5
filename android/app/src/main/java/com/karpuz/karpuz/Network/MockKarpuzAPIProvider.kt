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
        return Observable.just(KarpuzAPIModels.RegisterResponse(true, testToken, error = null)).delay(300, TimeUnit.MILLISECONDS)
    }

    override fun login(user: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse> {
        return Observable.just(KarpuzAPIModels.LoginResponse(true, testToken, null)).delay(300, TimeUnit.MILLISECONDS)
    }

    override fun getProjects(auth: String, projectIds: String): Observable<KarpuzAPIModels.ProjectsResponse> {
        TODO()
    }

    override fun getAllProjects(auth: String): Observable<KarpuzAPIModels.ProjectsResponse> {
        TODO()
    }

    override fun getUserProfile(auth: String): Observable<KarpuzAPIModels.UserResponse> {
        TODO()
    }

    override fun getUserProfile(auth: String, userId: String): Observable<KarpuzAPIModels.UserResponse> {
        TODO()
    }

    override fun createProject(
        auth: String,
        project: KarpuzAPIModels.CreateProjectBody
    ): Observable<KarpuzAPIModels.CreateProjectResponse> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}