from celery import Celery
from src.config import Config

def make_celery(app_name=__name__):
    celery = Celery(
        app_name,
        backend=Config.CELERY_RESULT_BACKEND,
        broker=Config.CELERY_BROKER_URL
    )
    celery.conf.update(
        result_expires=3600,
        task_serializer='json',
        accept_content=['json'],
    )
    return celery

# Global celery app instance
celery_app = make_celery()

@celery_app.task
def dummy_long_running_task(data):
    # This is a placeholder for heavy operations like sending mass emails or async processing
    import time
    time.sleep(2)
    return {"status": "success", "processed_data": data}
