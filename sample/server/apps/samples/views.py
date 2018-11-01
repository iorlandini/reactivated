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


from django.shortcuts import render
from formtools.wizard.views import SessionWizardView


class ContactWizard(SessionWizardView):
    def done(self, form_list, **kwargs):
        return render(self.request, 'done.html', {
            'form_data': [form.cleaned_data for form in form_list],
        })
