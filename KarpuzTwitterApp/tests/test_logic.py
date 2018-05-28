import logic
import pytest

location_parameters = [
    ({}, False),  # Empty input
    ({'q': 'test', 'result_type': 'mixed', 'count': 20}, False), # Missing GeoCode field
    ({'geocode': '11,11,1km', 'result_type': 'mixed', 'count': 20}, False), # Missing q field
    ({'q': 'test', 'geocode': '11,11,1km', 'count': 20}, False), # Missing result type field
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '11,11,1km'}, False), # Missing count field
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '11,11', 'count': 20}, False), # Wrong structure GeoCode
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '1,11,1,12km', 'count': 20}, False),  # Wrong structure GeoCode 1
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '11,11,1kk', 'count': 20}, False), # Wrong structure GeoCode 2
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '11,11,-1km', 'count': 20}, False),  # Wrong structure GeoCode 3
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '11,11,1akm', 'count': 20}, False),  # Wrong structure GeoCode 4
    ({'q': 'test', 'result_type': 'mixed', 'geocode': 'aa,11,1km', 'count': 20}, False),  # Wrong structure GeoCode 5
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '11a,11,1km', 'count': 20}, False),  # Wrong structure GeoCode 6
    ({'q': 'test', 'result_type': 'not_defined', 'geocode': '11,11,1km', 'count': 20}, False),  # Wrong type result type
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '11,11,1km', 'count': 'aa'}, False),  # Count not integer
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '11,11,1km', 'count': 10}, False),  # Count not 25, 50 or 100
    ({'q': 'test', 'result_type': 'mixed', 'geocode': '11,11,1km', 'count': 25}, True),  # Pass
    # TODO: Add third party testing
]


@pytest.mark.parametrize("given_input, expected_output", location_parameters)
def test_location_and_query(given_input, expected_output):
    """ Tests location query in the logic file. """
    response = logic.get_tweets_with_location_and_query(given_input)
    if 'response' in response:
        assert response['response'] == expected_output
    else:
        assert False


common_followers_parameters = [
    ({}, False), # Empty input
    ({'user_one': 'jeffdean'}, False), # Missing user_two parameter
    ({'user_two': 'jeffdean'}, False), # Missing user_one parameter
    ({'user_one': 'jeffdean', 'user_two': 'jack'}, True), # Pass
]


@pytest.mark.parametrize("given_input, expected_output", common_followers_parameters)
def test_common_followers(given_input, expected_output):
    """ Tests get common followers functionality in the logic file """
    response = logic.get_common_followers_of_two_users(given_input)
    if 'response' in response:
        assert response['response'] == expected_output
    else:
        assert False
