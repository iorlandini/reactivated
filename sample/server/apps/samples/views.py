from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from typing import NamedTuple
from reactivated import ssr


class TestProps(NamedTuple):
    foo: str
    bar: int


@ssr(props=TestProps)
def test_view(request: HttpRequest) -> TestProps:
    return TestProps(foo='atr', bar=1)
