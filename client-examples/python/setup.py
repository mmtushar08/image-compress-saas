from setuptools import setup, find_packages

setup(
    name="smartcompress",
    version="1.0.0",
    description="Official Python client for SmartCompress API",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.0"
    ],
    author="SmartCompress",
    license="MIT",
)
