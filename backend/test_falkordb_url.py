import os
import unittest
from app.config import Settings
from app.database import _sanitize_error, FalkorDBManager

class TestFalkorDBUrlAndConfig(unittest.TestCase):
    def test_clean_falkordb_url_whitespace_and_quotes(self):
        # Plain URL
        s1 = Settings(falkordb_url="falkors://falkordb:pass1@host.cloud:12345")
        self.assertEqual(s1.clean_falkordb_url, "falkors://falkordb:pass1@host.cloud:12345")

        # Surrounding whitespace
        s2 = Settings(falkordb_url="   falkors://falkordb:pass2@host.cloud:12345  \n")
        self.assertEqual(s2.clean_falkordb_url, "falkors://falkordb:pass2@host.cloud:12345")

        # Double quotes
        s3 = Settings(falkordb_url='"falkors://falkordb:pass3@host.cloud:12345"')
        self.assertEqual(s3.clean_falkordb_url, "falkors://falkordb:pass3@host.cloud:12345")

        # Single quotes
        s4 = Settings(falkordb_url="'falkors://falkordb:pass4@host.cloud:12345'")
        self.assertEqual(s4.clean_falkordb_url, "falkors://falkordb:pass4@host.cloud:12345")

        # Normalization from falkordbs:// to falkors://
        s5 = Settings(falkordb_url="falkordbs://falkordb:pass5@host.cloud:12345")
        self.assertEqual(s5.clean_falkordb_url, "falkors://falkordb:pass5@host.cloud:12345")

        # Normalization from falkordb:// to falkor://
        s6 = Settings(falkordb_url="falkordb://falkordb:pass6@host.cloud:12345")
        self.assertEqual(s6.clean_falkordb_url, "falkor://falkordb:pass6@host.cloud:12345")

        # rediss:// and redis:// support
        s7 = Settings(falkordb_url="rediss://falkordb:pass7@host.cloud:12345")
        self.assertEqual(s7.clean_falkordb_url, "rediss://falkordb:pass7@host.cloud:12345")

    def test_sanitize_error_masks_credentials(self):
        # With username
        raw1 = "Failed to connect to falkors://falkordb:super_secret_pw123@instance.falkordb.cloud:9999"
        masked1 = _sanitize_error(raw1)
        self.assertNotIn("super_secret_pw123", masked1)
        self.assertIn("falkors://falkordb:****@instance.falkordb.cloud:9999", masked1)

        # rediss:// format
        raw2 = "Error connecting to rediss://falkordb:mySecretPassword@db.falkordb.cloud:6379"
        masked2 = _sanitize_error(raw2)
        self.assertNotIn("mySecretPassword", masked2)
        self.assertIn("rediss://falkordb:****@db.falkordb.cloud:6379", masked2)

        # Password only
        raw3 = "Error with falkors://:onlyPassword@host:6379"
        masked3 = _sanitize_error(raw3)
        self.assertNotIn("onlyPassword", masked3)
        self.assertIn("falkors://:****@host:6379", masked3)

    def test_discrete_ssl_field(self):
        s_default = Settings()
        self.assertFalse(s_default.falkordb_ssl)

        s_ssl = Settings(falkordb_ssl=True)
        self.assertTrue(s_ssl.falkordb_ssl)

if __name__ == "__main__":
    unittest.main()
