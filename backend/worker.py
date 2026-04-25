import os
from celery import Celery

# User Rule: offload long-running requests to worker processes via a task queue

celery_app = Celery(
    "janveda_worker",
    broker=os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
)

@celery_app.task
def generate_voter_checklist_pdf(user_id: str, selections: list):
    # Long running task simulation
    import time
    time.sleep(5)
    return {"status": "completed", "pdf_url": "https://storage.googleapis.com/.../checklist.pdf"}
